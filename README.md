# Inventory Management System - AWS Deployment

Sistema de gestión de inventario desarrollado como Progressive Web App (PWA) con Node.js y PostgreSQL, desplegado en AWS utilizando RDS, EC2 y Elastic Beanstalk.

## 📋 Arquitectura del Proyecto

Este proyecto fue desarrollado siguiendo una arquitectura de tres capas en AWS:

### 1. **Base de Datos (AWS RDS PostgreSQL)**

Se creó una instancia de base de datos PostgreSQL en AWS RDS como primer paso:

- **Servicio**: Amazon RDS
- **Motor**: PostgreSQL
- **Endpoint**: `inventory-database.ctkgskqss28a.us-east-1.rds.amazonaws.com`
- **Puerto**: 5432
- **Configuración**: Publicly accessible con Security Groups configurados

### 2. **Aplicación (Node.js + Express)**

La aplicación se encarga de la lógica de negocio y la conexión con la base de datos:

- **Conexión a DB**: Configurada mediante variables de entorno
- **Pool de conexiones**: Implementado con el driver `pg` de PostgreSQL
- **API REST**: Endpoints CRUD completos para gestión de productos
- **PWA**: Service Workers para funcionalidad offline

### 3. **Infraestructura de Deployment (EC2 y Elastic Beanstalk)**

Las máquinas virtuales actúan como servidores web que ejecutan la aplicación:

- **EC2**: Instancia manual con deployment automatizado vía GitHub Actions
- **Elastic Beanstalk**: Deployment gestionado por AWS
- **Función**: Poner a disposición la aplicación web (no gestionan la DB directamente)

## ☁️ Deployment en AWS

### EC2 Deployment

La aplicación se despliega en EC2 y se mantiene actualizada automáticamente mediante GitHub Actions.
Para la primera instancia EC2, se hace una creacion de forma manual y via terminal se clona el repo, se instalan las dependencias necesarias, y se configura el **nohup** para que corra constantemente

EC2 corriendo
![EC2 corriendo]("ec2-running.png")

EC2 corriendo con nohup
![EC2 corriendo con nohup]("ec2-running-nohup.png")

1. **Setup inicial en EC2**:

   - Instalar Node.js, Git y PM2
   - Clonar el repositorio
   - Configurar variables de entorno
   - Iniciar con PM2

2. **Auto-deployment**:

   - Cada push a `main` activa GitHub Actions
   - GitHub Actions se conecta a EC2 via SSH
   - Ejecuta `git pull` y reinicia la aplicación

3. **Acceso**: `http://3.85.37.250:5432/`

### EC2 Deployment Automatizado

En este paso se crea una instancia configurada de igual forma que en paso anterior pero dichos comandos se hacen ejecutar al momento de crear la instancia. Esto se hace agregando la secuencia de comandos en una caja al final de la configuracion inicial de la instancia EC2.

#!/bin/bash
sudo apt update && sudo apt upgrade -y
git clone https://github.com/sottati/inventory.git
sudo apt install npm -y
cd inventory
npm run start

### Elastic Beanstalk Deployment

Deployment gestionado por AWS:

1. **Crear aplicación en Elastic Beanstalk**
2. **Configurar variables de entorno** en la consola de EB
3. **Deploy** mediante CLI o consola web

EC2 corriendo con nohup
![Elastic Beanstalk]("elastic-beanstalk.png")

### Security Groups AWS

**RDS Security Group** (entrada):

- PostgreSQL (5432) desde EC2 Security Group o VPC

## 🎓 Propósito Académico
