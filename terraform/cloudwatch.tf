/**
 *  ECSのcloud watch.
 */
#import {
#  to = aws_cloudwatch_log_group.ecs_cloudwatch_log
#  id = "/wportal/ecs"
#}
resource "aws_cloudwatch_log_group" "ecs_cloudwatch_log" {
  name              = "/wportal/ecs"
  retention_in_days = 60
}
