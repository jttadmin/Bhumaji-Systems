# Bhumaji Systems — website enquiry backend
# Contact form → API Gateway (HTTP API, throttled) → Lambda → Amazon SES → contactus@bhumaji.com
#
# Deployed automatically by .github/workflows/deploy.yml when AWS credentials are configured.
# State lives in an S3 bucket the workflow creates (bhumaji-tfstate-<account-id>).

terraform {
  required_version = ">= 1.10"
  required_providers {
    aws     = { source = "hashicorp/aws", version = "~> 5.80" }
    archive = { source = "hashicorp/archive", version = "~> 2.6" }
  }
  backend "s3" {
    key          = "bhumaji/enquiry.tfstate"
    use_lockfile = true
    encrypt      = true
  }
}

variable "region" {
  type    = string
  default = "ap-south-1"
}
variable "enquiry_email" {
  description = "Address that receives enquiries (and, once verified in SES, sends them)."
  type        = string
  default     = "contactus@bhumaji.com"
}
variable "allowed_origins" {
  type    = list(string)
  default = ["https://bhumaji.com", "https://www.bhumaji.com"]
}

provider "aws" {
  region = var.region
  default_tags {
    tags = { Project = "bhumaji-website", Component = "enquiry", ManagedBy = "terraform" }
  }
}

locals {
  name = "bhumaji-enquiry"
}

# SES sends a one-time verification email to this address. Until the link in it is clicked,
# enquiries cannot be sent. (In the SES sandbox, sending from and to the same verified address works.)
resource "aws_sesv2_email_identity" "enquiry" {
  email_identity = var.enquiry_email
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/index.mjs"
  output_path = "${path.module}/build/lambda.zip"
}

resource "aws_iam_role" "lambda" {
  name = "${local.name}-lambda"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{ Effect = "Allow", Action = "sts:AssumeRole", Principal = { Service = "lambda.amazonaws.com" } }]
  })
}

resource "aws_iam_role_policy" "lambda" {
  name = "send-enquiry"
  role = aws_iam_role.lambda.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ses:SendEmail"]
        Resource = aws_sesv2_email_identity.enquiry.arn
      },
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "${aws_cloudwatch_log_group.lambda.arn}:*"
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${local.name}"
  retention_in_days = 30
}

resource "aws_lambda_function" "enquiry" {
  function_name    = local.name
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs22.x"
  handler          = "index.handler"
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256
  timeout          = 10
  memory_size      = 256
  architectures    = ["arm64"]

  environment {
    variables = {
      ENQUIRY_TO      = var.enquiry_email
      ENQUIRY_FROM    = var.enquiry_email
      ALLOWED_ORIGINS = join(",", var.allowed_origins)
    }
  }

  depends_on = [aws_cloudwatch_log_group.lambda, aws_iam_role_policy.lambda]
}

resource "aws_apigatewayv2_api" "enquiry" {
  name          = local.name
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "enquiry" {
  api_id                 = aws_apigatewayv2_api.enquiry.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.enquiry.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "enquiry" {
  api_id    = aws_apigatewayv2_api.enquiry.id
  route_key = "POST /enquiry"
  target    = "integrations/${aws_apigatewayv2_integration.enquiry.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.enquiry.id
  name        = "$default"
  auto_deploy = true
  # Abuse protection: a contact form never needs more than this.
  default_route_settings {
    throttling_burst_limit = 5
    throttling_rate_limit  = 1
  }
}

resource "aws_lambda_permission" "api" {
  statement_id  = "AllowApiGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.enquiry.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.enquiry.execution_arn}/*/*/enquiry"
}

output "enquiry_url" {
  value = "${aws_apigatewayv2_api.enquiry.api_endpoint}/enquiry"
}

output "ses_identity_verified" {
  value = aws_sesv2_email_identity.enquiry.verified_for_sending_status
}
