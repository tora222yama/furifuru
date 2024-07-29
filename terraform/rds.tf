#
#/**
# *  rds securityグループ.
# */
#module "wportal2_rds_sg" {
#  source      = "./module/security_group"
#  name        = "wportal2-rds-sg"
#  vpc_id      = aws_vpc.aws_vpc_wportal2.id
#  port        = 3306
#  cidr_blocks = [aws_vpc.aws_vpc_wportal2.cidr_block]
#  tag_name    = "wportal-rds-sg"
#}
#
#/**
# *  rdsサブネットグループ.
# */
#resource "aws_db_subnet_group" "wportal2_db_subnet_group" {
#  name        = "wportal2-db-subnet-group"
#  description = "wportal2-db-subnet-group"
#  subnet_ids = [
#    aws_subnet.private_0.id,
#    aws_subnet.private_1.id
#  ]
#}
#
#/**
# *  rdsクラスター
# */
#resource "aws_rds_cluster" "wportal2_rds_cluster" {
#  cluster_identifier = "wportal2-rds-cluster"
#
#  db_subnet_group_name = aws_db_subnet_group.wportal2_db_subnet_group.name
#  vpc_security_group_ids = [
#    module.wportal2_rds_sg.security_group_id
#  ]
#
#  engine         = "aurora-mysql"
#  engine_version = "8.0.mysql_aurora.3.01.0"
#  port           = "3306"
#
#  database_name   = "wportal"
#  master_username = aws_ssm_parameter.wportal2_db_username.value
#  master_password = aws_ssm_parameter.wportal2_db_password.value
#
#  skip_final_snapshot = true
#
#  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.wportal2_rds_cluster_parameter_group.name
#}
#
#/**
# *  rdsクラスターインスタンス
# */
#resource "aws_rds_cluster_instance" "wportal2_rds_cluster_instance" {
#  identifier         = "wportal2-rds-cluster-instance"
#  cluster_identifier = aws_rds_cluster.wportal2_rds_cluster.id
#
#  engine         = aws_rds_cluster.wportal2_rds_cluster.engine
#  engine_version = aws_rds_cluster.wportal2_rds_cluster.engine_version
#
#  instance_class       = "db.t4g.medium"
#  db_subnet_group_name = aws_rds_cluster.wportal2_rds_cluster.db_subnet_group_name
#}
#
#/**
# *  rdsクラスターコンフィグ
# */
#resource "aws_rds_cluster_parameter_group" "wportal2_rds_cluster_parameter_group" {
#  name   = "wportal2-rds-cluster-parameter-group"
#  family = "aurora-mysql8.0"
#
#  parameter {
#    name  = "time_zone"
#    value = "Asia/Tokyo"
#  }
#}
#
