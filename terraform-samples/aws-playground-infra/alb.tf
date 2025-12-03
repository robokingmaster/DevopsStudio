// AWS ALB Configuration

data "aws_acm_certificate" "eis_certificate" {
  domain = var.domain_name
  statuses = ["ISSUED"]      
  types = ["AMAZON_ISSUED"]  
  most_recent = true         
}

resource "aws_lb" "eis-playground-alb" {
  depends_on         = [module.vpc]
  name               = local.alb_name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.eis_allow_sg.id]
  subnets            = [module.vpc.public_subnets[0],module.vpc.public_subnets[1]]

  tags = {
    Environment     = "dev"
    Name            = local.alb_name
    Owner           = var.tag_ownershortid
    OwnerName       = var.tag_ownername
    OwnerEmailID    = var.tag_owneremail
    OwnerTeamName   = var.tag_teamname
    OwnerTeamEmail  = var.tag_teamemail
    Department      = var.tag_department
    Manager         = var.tag_managername   
  }
}

# HTTPS listener must have a default action; here it forwards to the TG
resource "aws_lb_listener" "https_forward" {
  depends_on        = [aws_lb.eis-playground-alb]
  load_balancer_arn = aws_lb.eis-playground-alb.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.eis_certificate.arn
  ssl_policy        = "ELBSecurityPolicy-2016-08"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Service Unavailable"
      status_code  = "503"
    }
  }
}
