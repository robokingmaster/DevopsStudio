resource "aws_iam_role" "irsa-ebs-csi" {
  name               = "${module.eks.cluster_name}-ebs-csi"
  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::${var.aws_account_number}:oidc-provider/${module.eks.oidc_provider}"
            },
            "Action": [
                "sts:TagSession",
                "sts:AssumeRoleWithWebIdentity"
            ],
            "Condition": {
                "StringEquals": {
                    "${module.eks.oidc_provider}:sub": "system:serviceaccount:kube-system:ebs-csi-controller-sa",
                    "${module.eks.oidc_provider}:aud": "sts.amazonaws.com"
                }
            }
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach-driver-policy" {
  role       = aws_iam_role.irsa-ebs-csi.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}

resource "aws_iam_role_policy_attachment" "attach-ssm-manager-policy" {
  role       = aws_iam_role.irsa-ebs-csi.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

