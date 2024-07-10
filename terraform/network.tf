/**
 *  VPC
 */
resource "aws_vpc" "aws_vpc_wportal2" {
  cidr_block           = "10.10.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "wportal2-vpc"
  }
}

/**
 *  パブリックサブネット
 */
resource "aws_subnet" "public_0" {
  cidr_block              = "10.10.10.0/24"
  vpc_id                  = aws_vpc.aws_vpc_wportal2.id
  map_public_ip_on_launch = true
  availability_zone       = "ap-northeast-1a"

  tags = {
    Name = "wportal2-subnet-public-0"
  }
}
resource "aws_subnet" "public_1" {
  cidr_block              = "10.10.11.0/24"
  vpc_id                  = aws_vpc.aws_vpc_wportal2.id
  map_public_ip_on_launch = true
  availability_zone       = "ap-northeast-1c"

  tags = {
    Name = "wportal2-subnet-public-1"
  }
}

/**
 *  プライベートサブネット
 */
resource "aws_subnet" "private_0" {
  cidr_block              = "10.10.128.0/24"
  vpc_id                  = aws_vpc.aws_vpc_wportal2.id
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = false

  tags = {
    Name = "wportal2-subnet-private-0"
  }
}
resource "aws_subnet" "private_1" {
  cidr_block              = "10.10.129.0/24"
  vpc_id                  = aws_vpc.aws_vpc_wportal2.id
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = false

  tags = {
    Name = "wportal2-subnet-private-1"
  }
}

/**
 *  インターネットゲートウェイ
 */
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.aws_vpc_wportal2.id
}

/**
 *  ルートテーブル.
 */
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.aws_vpc_wportal2.id

  tags = {
    Name = "wportal2-rt-public"
  }
}
resource "aws_route_table" "private_0" {
  vpc_id = aws_vpc.aws_vpc_wportal2.id

  tags = {
    Name = "wportal2-rt-private-0"
  }
}
resource "aws_route_table" "private_1" {
  vpc_id = aws_vpc.aws_vpc_wportal2.id

  tags = {
    Name = "wportal2-rt-private-1"
  }
}

/**
 *  ルート
 */
resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  gateway_id             = aws_internet_gateway.igw.id
  destination_cidr_block = "0.0.0.0/0"
}
resource "aws_route" "private_0" {
  route_table_id         = aws_route_table.private_0.id
  nat_gateway_id         = aws_nat_gateway.nat_gateway_0.id
  destination_cidr_block = "0.0.0.0/0"
}
resource "aws_route" "private_1" {
  route_table_id         = aws_route_table.private_1.id
  nat_gateway_id         = aws_nat_gateway.nat_gateway_1.id
  destination_cidr_block = "0.0.0.0/0"
}

/**
 *  ルートテーブルの関連付け
 */
resource "aws_route_table_association" "public_0" {
  subnet_id      = aws_subnet.public_0.id
  route_table_id = aws_route_table.public.id
}
resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}
resource "aws_route_table_association" "private_0" {
  subnet_id      = aws_subnet.private_0.id
  route_table_id = aws_route_table.private_0.id
}
resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.private_1.id
  route_table_id = aws_route_table.private_1.id
}

/**
*   Elastic IP Address
*/
resource "aws_eip" "nat_gateway_0" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = "wportal2-eip-0"
  }
}
resource "aws_eip" "nat_gateway_1" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = "wportal2-eip-1"
  }
}

/**
*   NATゲートウェイ
*/
resource "aws_nat_gateway" "nat_gateway_0" {
  allocation_id = aws_eip.nat_gateway_0.id
  subnet_id     = aws_subnet.public_0.id
  depends_on    = [aws_internet_gateway.igw]

  tags = {
    Name = "wportal2-nat-0"
  }
}
resource "aws_nat_gateway" "nat_gateway_1" {
  allocation_id = aws_eip.nat_gateway_1.id
  subnet_id     = aws_subnet.public_1.id
  depends_on    = [aws_internet_gateway.igw]

  tags = {
    Name = "wportal2-nat-1"
  }
}

