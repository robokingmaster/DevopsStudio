
#!/usr/bin/env python3
"""
AWS Resource Management Script
--------------------------------
This script creates or deletes:
1) Route53 DNS CNAME record pointing to ALB DNS name
2) Target Group (TargetType=instance) with health check (protocol, path, success codes)
3) HTTPS Rule attached to ALB listener

Supports --dry-run mode for previewing actions without making changes.

USAGE EXAMPLES:
---------------
# Create resources with instance ID
python3 manage-dnsrecord.py \
  --action create \
  --aws_region us-east-1 \
  --vpc_name my-vpc \
  --alb_name my-alb \
  --hosted_zoneid Z123456789 \
  --instance_id i-0abcd1234efgh5678 \
  --target_host_port 8080 \
  --dns_record_name app.example.com \
  --resource_prefix myapp \
  --health_check_path /health \
  --health_check_protocol HTTP \
  --health_check_success_codes "200-399"

# Delete resources
python3 manage-dnsrecord.py \
  --action delete \
  --aws_region us-east-1 \
  --vpc_name my-vpc \
  --alb_name my-alb \
  --hosted_zoneid Z123456789 \
  --dns_record_name app.example.com \
  --resource_prefix myapp

# Dry-run (preview actions)
python3 manage-dnsrecord.py \
  --action create \
  --aws_region us-east-1 \
  --vpc_name my-vpc \
  --alb_name my-alb \
  --hosted_zoneid Z123456789 \
  --instance_id i-0abcd1234efgh5678 \
  --target_host_port 8080 \
  --dns_record_name app.example.com \
  --resource_prefix myapp \
  --health_check_path /health \
  --health_check_protocol HTTPS \
  --health_check_success_codes "200,302" \
  --dry-run
"""

import boto3
import argparse
import sys
from botocore.exceptions import ClientError

def log(message):
    print(f"[INFO] {message}")

def warn(message):
    print(f"[WARN] {message}")

def dry_run_log(action, details):
    print(f"[DRY-RUN] Would perform: {action} | Details: {details}")

# -------- Lookup helpers --------
def get_vpc_id(ec2_client, vpc_name, dry_run):
    if dry_run:
        dry_run_log("Fetch VPC ID", f"VPC Name: {vpc_name}")
        return "vpc-DRYRUN"
    try:
        response = ec2_client.describe_vpcs(Filters=[{'Name': 'tag:Name', 'Values': [vpc_name]}])
        vpcs = response.get('Vpcs', [])
        if not vpcs:
            warn(f"VPC '{vpc_name}' not found.")
            sys.exit(1)
        return vpcs[0]['VpcId']
    except ClientError as e:
        warn(f"Failed to get VPC ID: {e}")
        sys.exit(1)

def get_alb_info(elbv2_client, alb_name, dry_run):
    if dry_run:
        dry_run_log("Fetch ALB Info", f"ALB Name: {alb_name}")
        return "alb-arn-DRYRUN", "alb-dns-DRYRUN.example.com"
    try:
        response = elbv2_client.describe_load_balancers(Names=[alb_name])
        albs = response.get('LoadBalancers', [])
        if not albs:
            warn(f"ALB '{alb_name}' not found.")
            sys.exit(1)
        alb = albs[0]
        return alb['LoadBalancerArn'], alb['DNSName']
    except ClientError as e:
        warn(f"Failed to get ALB info: {e}")
        sys.exit(1)

def get_listener_arn(elbv2_client, alb_arn, listener_port, dry_run):
    if dry_run:
        dry_run_log("Fetch Listener ARN", f"ALB ARN: {alb_arn}, Port: {listener_port}")
        return "listener-arn-DRYRUN"
    try:
        response = elbv2_client.describe_listeners(LoadBalancerArn=alb_arn)
        for listener in response.get('Listeners', []):
            if listener['Port'] == listener_port:
                return listener['ListenerArn']
        warn(f"Listener on port {listener_port} not found.")
        sys.exit(1)
    except ClientError as e:
        warn(f"Failed to get listener ARN: {e}")
        sys.exit(1)

# -------- Create operations --------
def ensure_target_group(elbv2_client, resource_prefix, vpc_id, target_host_port,
                        health_check_path, health_check_protocol, health_check_success_codes, dry_run):
    tg_name = f"{resource_prefix}-tg"
    if dry_run:
        dry_run_log("Ensure Target Group",
                    f"Name: {tg_name}, VPC: {vpc_id}, Port: {target_host_port}, "
                    f"TargetType=instance, HealthCheckProtocol={health_check_protocol}, "
                    f"HealthCheckPath={health_check_path}, SuccessCodes={health_check_success_codes}")
        return "tg-arn-DRYRUN"

    # Try to find existing TG first (idempotency)
    try:
        resp = elbv2_client.describe_target_groups(Names=[tg_name])
        tgs = resp.get('TargetGroups', [])
        if tgs:
            log(f"Target group '{tg_name}' already exists.")
            return tgs[0]['TargetGroupArn']
    except ClientError as e:
        # If not found, proceed to creation; any other error is fatal
        if "TargetGroupNotFound" not in str(e):
            warn(f"Error checking target group: {e}")
            sys.exit(1)

    try:
        response = elbv2_client.create_target_group(
            Name=tg_name,
            Protocol='HTTP',
            Port=target_host_port,
            VpcId=vpc_id,
            TargetType='instance',
            HealthCheckProtocol=health_check_protocol,  # HTTP or HTTPS
            HealthCheckPath=health_check_path,
            Matcher={'HttpCode': health_check_success_codes}
        )
        tg_arn = response['TargetGroups'][0]['TargetGroupArn']
        log(f"Created target group '{tg_name}'.")
        return tg_arn
    except ClientError as e:
        warn(f"Failed to create target group: {e}")
        sys.exit(1)

def register_instance_target(elbv2_client, target_group_arn, instance_id, target_host_port, dry_run):
    if dry_run:
        dry_run_log("Register Target", f"Instance ID: {instance_id}, Port: {target_host_port}, TG: {target_group_arn}")
        return
    try:
        elbv2_client.register_targets(
            TargetGroupArn=target_group_arn,
            Targets=[{'Id': instance_id, 'Port': target_host_port}]
        )
        log(f"Registered instance {instance_id}:{target_host_port}.")
    except ClientError as e:
        warn(f"Failed to register target: {e}")
        sys.exit(1)

def ensure_https_rule(elbv2_client, listener_arn, target_group_arn, routing_condition, dry_run):
    # If rule already exists for host-header condition, return it
    try:
        if dry_run:
            dry_run_log("Check/Create HTTPS Rule", f"Listener: {listener_arn}, TG: {target_group_arn}, Condition: {routing_condition}")
            return "rule-arn-DRYRUN"

        resp = elbv2_client.describe_rules(ListenerArn=listener_arn)
        
        # Collect priorities
        existing_priorities = set()

        for rule in resp.get('Rules', []):
            if 'Priority' in rule and rule['Priority'] != 'default':
                    existing_priorities.add(int(rule['Priority']))
            for cond in rule.get('Conditions', []):
                if cond['Field'] == 'host-header' and routing_condition in cond.get('Values', []):
                    log(f"HTTPS rule for host-header '{routing_condition}' already exists.")
                    return rule['RuleArn']

        # Find next available priority
        next_priority = 1
        while next_priority in existing_priorities:
            next_priority += 1

        # Create rule
        response = elbv2_client.create_rule(
            ListenerArn=listener_arn,
            Conditions=[{'Field': 'host-header', 'HostHeaderConfig': {'Values': [routing_condition]}}], 
            Priority=next_priority,          
            Actions=[{'Type': 'forward', 'ForwardConfig': {'TargetGroups': [{'TargetGroupArn': target_group_arn, 'Weight': 1}]}}]
        )
        rule_arn = response['Rules'][0]['RuleArn']
        log(f"Created HTTPS rule.")
        return rule_arn
    except ClientError as e:
        warn(f"Failed to ensure HTTPS rule: {e}")
        sys.exit(1)

def upsert_dns_cname(route53_client, hosted_zoneid, dns_record_name, alb_dns_name, dry_run):
    if dry_run:
        dry_run_log("UPSERT DNS Record", f"Name: {dns_record_name}, CNAME -> {alb_dns_name}, Zone: {hosted_zoneid}")
        return
    try:
        route53_client.change_resource_record_sets(
            HostedZoneId=hosted_zoneid,
            ChangeBatch={
                'Changes': [{
                    'Action': 'UPSERT',
                    'ResourceRecordSet': {
                        'Name': dns_record_name,
                        'Type': 'CNAME',
                        'TTL': 300,
                        'ResourceRecords': [{'Value': alb_dns_name}]
                    }
                }]
            }
        )
        log(f"Created/Updated DNS CNAME '{dns_record_name}' -> '{alb_dns_name}'.")
    except ClientError as e:
        warn(f"Failed to upsert DNS record: {e}")
        sys.exit(1)

# -------- Deletion operations (automatic lookups) --------
def delete_https_rule(elbv2_client, listener_arn, routing_condition, dry_run):
    try:
        if dry_run:
            dry_run_log("Delete HTTPS Rule (lookup)", f"Listener: {listener_arn}, Condition: {routing_condition}")
            return
        resp = elbv2_client.describe_rules(ListenerArn=listener_arn)
        for rule in resp.get('Rules', []):
            for cond in rule.get('Conditions', []):
                if cond['Field'] == 'host-header' and routing_condition in cond.get('Values', []):
                    elbv2_client.delete_rule(RuleArn=rule['RuleArn'])
                    log(f"Deleted HTTPS rule for host-header '{routing_condition}'.")
                    return
        warn(f"No HTTPS rule found for host-header '{routing_condition}'.")
    except ClientError as e:
        warn(f"Failed to delete HTTPS rule: {e}")

def delete_target_group(elbv2_client, resource_prefix, dry_run):
    tg_name = f"{resource_prefix}-tg"
    try:
        if dry_run:
            dry_run_log("Delete Target Group (lookup)", f"Name: {tg_name}")
            return
        resp = elbv2_client.describe_target_groups(Names=[tg_name])
        tgs = resp.get('TargetGroups', [])
        if not tgs:
            warn(f"Target group '{tg_name}' does not exist.")
            return
        elbv2_client.delete_target_group(TargetGroupArn=tgs[0]['TargetGroupArn'])
        log(f"Deleted target group '{tg_name}'.")
    except ClientError as e:
        warn(f"Failed to delete target group: {e}")

def delete_dns_record(route53_client, hosted_zoneid, dns_record_name, dry_run):
    try:
        if dry_run:
            dry_run_log("Delete DNS CNAME (lookup)", f"Name: {dns_record_name}, Zone: {hosted_zoneid}")
            return
        # Must provide exact record to delete; fetch current value first
        paginator = route53_client.get_paginator('list_resource_record_sets')
        for page in paginator.paginate(HostedZoneId=hosted_zoneid):
            for record in page.get('ResourceRecordSets', []):
                # Normalize dot termination from Route53 API
                if record['Type'] == 'CNAME' and record['Name'].rstrip('.') == dns_record_name:
                    if not record.get('ResourceRecords'):
                        warn(f"CNAME '{dns_record_name}' has no ResourceRecords; skipping delete.")
                        return
                    current_value = record['ResourceRecords'][0]['Value']
                    route53_client.change_resource_record_sets(
                        HostedZoneId=hosted_zoneid,
                        ChangeBatch={
                            'Changes': [{
                                'Action': 'DELETE',
                                'ResourceRecordSet': {
                                    'Name': dns_record_name,
                                    'Type': 'CNAME',
                                    'TTL': record.get('TTL', 300),
                                    'ResourceRecords': [{'Value': current_value}]
                                }
                            }]
                        }
                    )
                    log(f"Deleted DNS CNAME '{dns_record_name}'.")
                    return
        warn(f"No DNS CNAME record found for '{dns_record_name}'.")
    except ClientError as e:
        warn(f"Failed to delete DNS record: {e}")

# -------- Main --------
def main():
    parser = argparse.ArgumentParser(description="Create or delete AWS resources (ALB + Route53 + Target Group).")
    parser.add_argument('--action', choices=['create', 'delete'], required=True)
    parser.add_argument('--aws_region', required=True)
    parser.add_argument('--vpc_name', required=True)
    parser.add_argument('--alb_name', required=True)
    parser.add_argument('--hosted_zoneid', required=True)
    parser.add_argument('--instance_id', required=False)  # required for create
    parser.add_argument('--target_host_port', type=int, required=False)  # required for create
    parser.add_argument('--dns_record_name', required=True)
    parser.add_argument('--resource_prefix', required=True)
    parser.add_argument('--listener_port', type=int, default=443)
    parser.add_argument('--health_check_path', default='/')
    parser.add_argument('--health_check_protocol', choices=['HTTP', 'HTTPS'], default='HTTP')
    parser.add_argument('--health_check_success_codes', default='200-399',
                        help="Comma-separated list or ranges (e.g., '200', '200-399', '200,302').")
    parser.add_argument('--routing_condition', default=None,
                        help="Host header value for routing (defaults to dns_record_name).")
    parser.add_argument('--dry-run', action='store_true', help="Preview actions without making changes")

    args = parser.parse_args()
    dry_run = args.dry_run

    # Basic validation for create path
    if args.action == 'create':
        missing = []
        if not args.instance_id: missing.append('--instance_id')
        if not args.target_host_port: missing.append('--target_host_port')
        if missing:
            warn(f"Missing required arguments for create: {', '.join(missing)}")
            sys.exit(1)

    ec2_client = boto3.client('ec2', region_name=args.aws_region)
    elbv2_client = boto3.client('elbv2', region_name=args.aws_region)
    route53_client = boto3.client('route53', region_name=args.aws_region)

    alb_arn, alb_dns_name = get_alb_info(elbv2_client, args.alb_name, dry_run)
    listener_arn = get_listener_arn(elbv2_client, alb_arn, args.listener_port, dry_run)
    routing_condition = args.routing_condition if args.routing_condition else args.dns_record_name

    if args.action == 'create':
        vpc_id = get_vpc_id(ec2_client, args.vpc_name, dry_run)
        tg_arn = ensure_target_group(
            elbv2_client=elbv2_client,
            resource_prefix=args.resource_prefix,
            vpc_id=vpc_id,
            target_host_port=args.target_host_port,
            health_check_path=args.health_check_path,
            health_check_protocol=args.health_check_protocol,
            health_check_success_codes=args.health_check_success_codes,
            dry_run=dry_run
        )
        register_instance_target(elbv2_client, tg_arn, args.instance_id, args.target_host_port, dry_run)
        ensure_https_rule(elbv2_client, listener_arn, tg_arn, routing_condition, dry_run)
        upsert_dns_cname(route53_client, args.hosted_zoneid, args.dns_record_name, alb_dns_name, dry_run)
        log("✅ Dry-run completed." if dry_run else "✅ Resource creation completed successfully.")
    else:
        delete_https_rule(elbv2_client, listener_arn, routing_condition, dry_run)
        delete_target_group(elbv2_client, args.resource_prefix, dry_run)
        delete_dns_record(route53_client, args.hosted_zoneid, args.dns_record_name, dry_run)
        log("✅ Dry-run completed." if dry_run else "✅ Resource deletion completed successfully.")

if __name__ == "__main__":
    main()
