terraform {
  required_version = ">= 1.6.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.110.0"
    }
    random = {
      source = "hashicorp/random"
      version = ">= 3.6.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.aks_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "${var.project}-aks"

  default_node_pool {
    name       = "system"
    node_count = var.aks_node_count
    vm_size    = var.aks_vm_size
  }

  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [default_node_pool[0].node_count]
  }
}

resource "random_password" "pg_password" {
  length  = 16
  special = true
}

resource "azurerm_postgresql_flexible_server" "pg" {
  name                   = var.pg_name
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  version                = "16"
  administrator_login    = var.pg_admin_user
  administrator_password = random_password.pg_password.result
  storage_mb             = 32768
  sku_name               = var.pg_sku_name

  // High availability not supported on basic tier, removed
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "aks_name" {
  value = azurerm_kubernetes_cluster.aks.name
}

output "pg_connection_string" {
  value       = "postgresql://${var.pg_admin_user}:${random_password.pg_password.result}@${azurerm_postgresql_flexible_server.pg.fqdn}:5432/${var.pg_database}?sslmode=require"
  sensitive   = true
  description = "Use as DATABASE_URL"
}



