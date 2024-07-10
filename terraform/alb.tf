/**
 *  アプリケーションロードバランサ
 */

resource "aws_alb" "wportal2_alb" {
  name                       = "wportal2-alb"
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
    Name = "wportal2-alb"
  }
}

# TODO: 次はここから