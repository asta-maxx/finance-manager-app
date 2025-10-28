variable "subscription_id" {
  type        = string
  description = "Azure subscription ID"
}

variable "project" {
  type    = string
  default = "finance"
}

variable "location" {
  type    = string
  default = "westus3"
}

variable "resource_group_name" {
  type    = string
  default = "finance-rg"
}

variable "acr_name" {
  type    = string
  default = "financeacr12345"
}

variable "aks_name" {
  type    = string
  default = "finance-aks"
}

variable "aks_node_count" {
  type    = number
  default = 1
}

variable "aks_vm_size" {
  type    = string
  default = "Standard_B2s"
}

variable "pg_name" {
  type    = string
  default = "finance-pg"
}

variable "pg_admin_user" {
  type    = string
  default = "pgadmin"
}

variable "pg_database" {
  type    = string
  default = "finance"
}

variable "pg_sku_name" {
  type    = string
  default = "B_Standard_B1ms"
}



