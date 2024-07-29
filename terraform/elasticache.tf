#/**
# *  ElastiCacheパラメータグループ.
# */
#resource "aws_elasticache_parameter_group" "wportal2_elasticache_pg" {
#  family = "redis7.x"
#  name   = "wportal2-elasticache-pg"
#
#  parameter {
#    name  = "cluster-enabled"
#    value = "no"
#  }
#}
#
#/**
# *  ElastiCacheサブネットグループ.
# */
#resource "aws_elasticache_subnet_group" "wportal2_elasticache_sg" {
#  name = "wportal2-elasticache-sg"
#  subnet_ids = [
#    aws_subnet.private_0.id,
#    aws_subnet.private_1.id
#  ]
#}
#
#/**
# *  ElastiCacheレプリケーショングループ.
# */
#resource "aws_elasticache_replication_group" "wportal2_elasticache_rg" {
#  description                = "wportal2 (Cluster Disabled)"
#  replication_group_id       = "wportal2-elasticache-rg"
#//  replication_group_description = "wportal2 (Cluster Disabled)"
#  engine                     = "redis"
#//  engine_version             = "7.x"
#  num_cache_clusters         = 2
#  node_type                  = "cache.t3.micro"
#  snapshot_window            = "09:10-10:10"
#  snapshot_retention_limit   = 7
#  maintenance_window         = "mon:10:40-mon:11:40"
#  automatic_failover_enabled = true
#  port                       = 6379
#  apply_immediately          = false
#  security_group_ids = [
#    module.redis_sg.security_group_id
#  ]
#  parameter_group_name = aws_elasticache_parameter_group.wportal2_elasticache_pg.name
#  subnet_group_name    = aws_elasticache_subnet_group.wportal2_elasticache_sg.name
#}
#
#module "redis_sg" {
#  source      = "./module/security_group"
#  name        = "redis-sg"
#  vpc_id      = aws_vpc.aws_vpc_wportal2.id
#  port        = 6379
#  cidr_blocks = [aws_vpc.aws_vpc_wportal2.cidr_block]
#  tag_name    = "wportal2-redis-sg"
#}