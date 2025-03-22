
# This can also be skipped at this time and later added as add-ons from EKS page as well.
# Required identiti provided role will be already created which can be reused while adding this add-ons.

resource "aws_eks_addon" "addons-aws-ebs-csi-driver" {
  cluster_name                = local.cluster_name
  addon_name                  = "aws-ebs-csi-driver"  
  service_account_role_arn    = aws_iam_role.irsa-ebs-csi.arn
  
  depends_on = [module.eks]
}
