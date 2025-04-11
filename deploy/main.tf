# deploy/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.3.0"
}

provider "aws" {
  region = "us-east-1"
}

# need to add real AWS credentials later
resource "aws_s3_bucket" "example" {
  bucket = "example-bucket-hi"
  acl    = "private"
}
