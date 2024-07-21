/**
 *  Simple Email Service.
 */

/**
 *  domain-identify
 */
resource "aws_ses_domain_identity" "wportal2_ses_domain_identify" {
  domain = data.aws_route53_zone.wportal.name
}

resource "aws_route53_record" "wportal2_ses_txt" {
  zone_id = data.aws_route53_zone.wportal.zone_id
  name    = "_amazonses.${data.aws_route53_zone.wportal.name}"
  type    = "TXT"
  ttl     = 600
  records = [
    aws_ses_domain_identity.wportal2_ses_domain_identify.verification_token
  ]
}

/**
 *  DKIM
 */
resource "aws_ses_domain_dkim" "wportal2_ses_domain_dkim" {
  domain = data.aws_route53_zone.wportal.name
}

resource "aws_route53_record" "wportal2_ses_cname_dkim" {
  count   = 3
  zone_id = data.aws_route53_zone.wportal.zone_id
  name    = "${element(aws_ses_domain_dkim.wportal2_ses_domain_dkim.dkim_tokens, count.index)}._domainkey.${data.aws_route53_zone.wportal.name}"
  type    = "CNAME"
  ttl     = 600
  records = [
    "${element(aws_ses_domain_dkim.wportal2_ses_domain_dkim.dkim_tokens, count.index)}.dkim.amazonses.com"
  ]
}

/**
 *  SPF
 */
resource "aws_ses_domain_mail_from" "wportal2_ses_domain_mail_from" {
  domain           = data.aws_route53_zone.wportal.name
  mail_from_domain = "mail.${data.aws_route53_zone.wportal.name}"
}

resource "aws_route53_record" "wportal_ses_mx_mail" {
  zone_id = data.aws_route53_zone.wportal.zone_id
  name    = aws_ses_domain_mail_from.wportal2_ses_domain_mail_from.mail_from_domain
  type    = "MX"
  ttl     = 600
  records = [
    "10 feedback-smtp.ap-northeast-1.amazonses.com"
  ]
}

resource "aws_route53_record" "wportal_ses_txt_mail" {
  zone_id = data.aws_route53_zone.wportal.zone_id
  name    = aws_ses_domain_mail_from.wportal2_ses_domain_mail_from.mail_from_domain
  type    = "TXT"
  ttl     = 600
  records = [
    "v=spf1 include:amazonses.com ~all"
  ]
}

/**
 *  DMARC
 */
resource "aws_route53_record" "wportal2_ses_txt_dmarc" {
  zone_id = data.aws_route53_zone.wportal.zone_id
  name    = "_dmarc.wportal.org"
  type    = "TXT"
  ttl     = 600
  records = [
    "v=DMARC1;p=quarantine;pct=25;rua=mailto:dmarcreports@wportal.org"
  ]
}
