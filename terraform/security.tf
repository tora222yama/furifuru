#/**
# * セキュリティグループ
# */
#
#/**
# *  HTTPロードバランサ
# */
#module "http_sg" {
#  source      = "./module/security_group"
#  name        = "wportal2-http-sg"
#  vpc_id      = aws_vpc.aws_vpc_wportal2.id
#  port        = 80
#  cidr_blocks = ["0.0.0.0/0"]
#
#  tag_name = "wportal2-http-sg"
#}
#
#/**
# *  HTTPSロードバランサ
# */
#module "https_sg" {
#  source      = "./module/security_group"
#  name        = "wportal2-https-sg"
#  vpc_id      = aws_vpc.aws_vpc_wportal2.id
#  port        = 443
#  cidr_blocks = ["0.0.0.0/0"]
#
#  tag_name = "wportal2-https-sg"
#}
#
#/**
# *  リダイレクト用
# */
#module "http_redirect_sg" {
#  source      = "./module/security_group"
#  name        = "wportal2-http-redirect-sg"
#  vpc_id      = aws_vpc.aws_vpc_wportal2.id
#  port        = 8080
#  cidr_blocks = ["0.0.0.0/0"]
#
#  tag_name = "wportal2-http-redirect-sg"
#}