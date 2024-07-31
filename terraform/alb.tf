/**
 *  アプリケーションロードバランサ
 */

resource "aws_alb" "wportal_alb" {
  name                       = "wportal-alb"
  load_balancer_type         = "application"
  internal                   = false
  idle_timeout               = 60
  enable_deletion_protection = false # とりあえず削除保護は無効

  subnets = [
    aws_subnet.public_0.id,
    aws_subnet.public_1.id
  ]

  access_logs {
    bucket  = aws_s3_bucket.alb_log.id
    enabled = true
  }

  security_groups = [
    module.http_sg.security_group_id,
    module.https_sg.security_group_id,
    module.http_redirect_sg.security_group_id
  ]

  tags = {
    Name = "wportal-alb"
  }
}

output "alb_dns_name" {
  value = aws_alb.wportal_alb.dns_name
}

/**
 *  HTTPリスナー
 */
resource "aws_alb_listener" "http_listener" {
  load_balancer_arn = aws_alb.wportal_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "this is http."
      status_code  = "200"
    }
  }
}

/**
 *  ホストゾーンのデータソース
 */
data "aws_route53_zone" "wportal" {
  name = "wportal.org"
}

/**
 *  ホストゾーン
 */
resource "aws_route53_zone" "app_wportal" {
  name = "app.wportal.com"

  tags = {
    Name = "wportal-host-zone"
  }
}

/**
 *  DNSレコード
 */
resource "aws_route53_record" "app" {
  name    = data.aws_route53_zone.wportal.name
  type    = "A"
  zone_id = data.aws_route53_zone.wportal.zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_alb.wportal_alb.dns_name
    zone_id                = aws_alb.wportal_alb.zone_id
  }
}

/**
 *  SSL証明書定義
 */
resource "aws_acm_certificate" "app_certificate" {
  domain_name               = data.aws_route53_zone.wportal.name
  subject_alternative_names = []
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

/**
 *  SSL証明書の検証用レコード.
 */
resource "aws_route53_record" "app_certificate_record" {
  for_each = {
    for dvo in aws_acm_certificate.app_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  allow_overwrite = true
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  zone_id         = data.aws_route53_zone.wportal.id
  ttl             = 60
}

/**
 *  apply時にSSL検証の完了を待つ
 */
resource "aws_acm_certificate_validation" "app_certificate_validation" {
  certificate_arn = aws_acm_certificate.app_certificate.arn
  validation_record_fqdns = [
    for record in aws_route53_record.app_certificate_record : record.fqdn
  ]
}

/**
 *  HTTPSリスナー
 */
resource "aws_alb_listener" "https" {
  load_balancer_arn = aws_alb.wportal_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.app_certificate.arn
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "this is https."
      status_code  = "200"
    }
  }

  depends_on = [
    aws_acm_certificate_validation.app_certificate_validation
  ]
}

/**
* HTTP->HTTPSリダイレクトリスナー
*/
resource "aws_alb_listener" "redirect_http_to_https" {
  load_balancer_arn = aws_alb.wportal_alb.arn
  port              = "8080"
  protocol          = "HTTP"
  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

/**
 *  転送先のターゲットグループ.
 */
resource "aws_alb_target_group" "alb_target_group" {
  name                 = "alb-target-group"
  vpc_id               = aws_vpc.aws_vpc_wportal.id
  target_type          = "ip"
  port                 = 80
  protocol             = "HTTP"
  deregistration_delay = 5
  health_check {
    path                = "/api/healthcheck"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 4
    interval            = 5
  }

  depends_on = [aws_alb.wportal_alb]
}

/**
 *  リスナールール.
 */
resource "aws_alb_listener_rule" "alb_listener_rule" {
  listener_arn = aws_alb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.alb_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}