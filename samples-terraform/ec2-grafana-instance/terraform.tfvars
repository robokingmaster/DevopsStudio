aws_region              = "us-east-2"
vpc_name                = "eis-playground-vpc"
sg_name                 = "eis-playground-sg"
alb_name                = "eis-playground-alb"
hosted_zoneid           = "XXXXXXXXXXXXXXXXX"

resource_prefix         = "grafana"
ec2_source_ami          = "ami-0f5fcdfbd140e4ab7"     // Ubuntu System
key_pair_name           = "xxxxxxxxxxx"
domain_name             = "example.com"

tag_ownershortid      = "robo1"
tag_ownername         = "RoboKing"
tag_owneremail        = "robokingmaster@gmail.com"
tag_teamname          = "None"
tag_teamemail         = "None"
tag_department        = "None"
tag_costcenter        = "None"
tag_managername       = "None"