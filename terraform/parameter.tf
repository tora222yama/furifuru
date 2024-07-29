#/**
# *  KMSによるパラメータ
# */
#
#/**
# *  DBホスト.
# */
#resource "aws_ssm_parameter" "wportal2_db_host" {
#  name  = "/wportal2/db/host"
#  type  = "String"
#  value = aws_rds_cluster.wportal2_rds_cluster.endpoint
#}
#
#/**
# *  DBユーザー.
# */
#resource "aws_ssm_parameter" "wportal2_db_username" {
#  name        = "/wportal2/db/username"
#  type        = "String"
#  value       = "wportal2"
#  description = "データベースの接続ユーザー"
#}
#
#/**
# *  DBパスワード.
# */
#resource "aws_ssm_parameter" "wportal2_db_password" {
#  name        = "/wportal2/db/password"
#  type        = "SecureString"
#  value       = "uninitialized"
#  description = "データベースの接続パスワード"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  Redisホスト
# */
#resource "aws_ssm_parameter" "wportal2_redis_host" {
#  name  = "/wportal2/redis/host"
#  type  = "String"
#  value = aws_elasticache_replication_group.wportal2_elasticache_rg.primary_endpoint_address
#}
#
#/**
# *  GOOGLE_CLIENT_ID
# */
#resource "aws_ssm_parameter" "wportal2_google_client_id" {
#  name        = "/wportal2/google_client_id"
#  type        = "SecureString"
#  value       = "uninitialized"
#  description = "GOOGLE_CLIENT_ID"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  GOOGLE_CLIENT_SECRET
# */
#resource "aws_ssm_parameter" "wportal2_google_client_secret" {
#  name        = "/wportal2/google_client_secret"
#  type        = "SecureString"
#  value       = "uninitialized"
#  description = "GOOGLE_CLIENT_SECRET"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  SLACK_APP_TOKEN
# */
#resource "aws_ssm_parameter" "wportal2_slack_app_token" {
#  name  = "/wportal2/slack_app_token"
#  type  = "SecureString"
#  value = "uninitialized"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  SLACK_BOT_USER_OAUTH_TOKEN
# */
#resource "aws_ssm_parameter" "wportal2_slack_bot_user_oauth_token" {
#  name  = "/wportal2/slack_bot_user_oauth_token"
#  type  = "SecureString"
#  value = "uninitialized"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  SLACK_URL_NOTICE
# */
#resource "aws_ssm_parameter" "wportal2_slack_url_notice" {
#  name  = "/wportal2/slack_url_notice"
#  type  = "SecureString"
#  value = "uninitialized"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  RECAPTCHA_SECRET_KEY
# */
#resource "aws_ssm_parameter" "wportal2_recaptcha_secret_key" {
#  name  = "/wportal2/recaptcha_secret_key"
#  type  = "SecureString"
#  value = "uninitialized"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  VITE_RECAPTCHA_SITE_KEY
# */
#resource "aws_ssm_parameter" "wportal2_vite_recaptcha_site_key" {
#  name  = "/wportal2/vite_recaptcha_site_key"
#  type  = "SecureString"
#  value = "uninitialized"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  APP_AWS_ACCESS_KEY_ID
# */
#resource "aws_ssm_parameter" "wportal2_app_aws_access_key_id" {
#  name  = "/wportal2/app_aws_access_key_id"
#  type  = "SecureString"
#  value = "uninitialized"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  APP_AWS_SECRET_ACCESS_KEY
# */
#resource "aws_ssm_parameter" "wportal2_app_aws_secret_access_key" {
#  name  = "/wportal2/app_aws_secret_access_key"
#  type  = "SecureString"
#  value = "uninitialized"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
#
#/**
# *  APP_AWS_REGION
# */
#resource "aws_ssm_parameter" "wportal2_app_aws_region" {
#  name  = "/wportal2/app_aws_region"
#  type  = "SecureString"
#  value = "uninitialized"
#
#  lifecycle {
#    ignore_changes = [value]
#  }
#}
