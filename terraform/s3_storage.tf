#/**
# *  wportalストレージバケット.
# */
#
#resource "aws_s3_bucket" "wportal2_storage" {
#  bucket        = "wportal2-storage"
#  force_destroy = true
#}
#
#/**
# *  ブロックパブリックアクセス.
# */
#resource "aws_s3_bucket_public_access_block" "wportal2_storage" {
#  bucket                  = aws_s3_bucket.wportal2_storage.id
#  block_public_acls       = true
#  block_public_policy     = true
#  ignore_public_acls      = true
#  restrict_public_buckets = true
#}
#
#/**
# *  暗号化設定.
# */
#resource "aws_s3_bucket_server_side_encryption_configuration" "wportal2_storage" {
#  bucket = aws_s3_bucket.wportal2_storage.id
#  rule {
#    apply_server_side_encryption_by_default {
#      sse_algorithm = "AES256"
#    }
#  }
#}