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

## 🎯 Flujo de Implementación

```
1. AWS RDS PostgreSQL creada ✓
   └─→ Base de datos lista y accesible

2. Aplicación configurada ✓
   └─→ Código conectado a RDS mediante variables de entorno

3. EC2 Instance desplegada ✓
   └─→ Servidor web ejecutando la aplicación

4. Elastic Beanstalk desplegado ✓
   └─→ Ambiente gestionado ejecutando la aplicación
```

## 🚀 Características

- ✅ API REST completa (CRUD)
- ✅ Base de datos PostgreSQL en AWS RDS
- ✅ Progressive Web App (funcionalidad offline)
- ✅ Interfaz web responsive
- ✅ Estadísticas de inventario en tiempo real
- ✅ Auto-deployment con GitHub Actions
- ✅ Deployment múltiple (EC2 y Elastic Beanstalk)

## 🛠 Tecnologías

- **Backend**: Node.js + Express 5.1.0
- **Base de datos**: PostgreSQL (AWS RDS)
- **Driver DB**: pg (node-postgres) 8.x
- **Frontend**: JavaScript vanilla + PWA
- **Infraestructura**: AWS (RDS, EC2, Elastic Beanstalk)
- **CI/CD**: GitHub Actions
- **Process Manager**: PM2 (para EC2)

## 📦 Configuración Local

### Requisitos previos
- Node.js 18+
- Acceso a la base de datos RDS (credenciales)

### Instalación

1. Clonar el repositorio:
```bash
git clone <tu-repo-url>
cd inventory
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` con las credenciales de la base de datos:
```env
DB_HOST=inventory-database.ctkgskqss28a.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=admin
DB_PASSWORD=tu_password_aqui
DB_SSL=false
PORT=80
```

4. Iniciar el servidor:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:80`

## ☁️ Deployment en AWS

### EC2 Deployment

La aplicación se despliega en EC2 y se mantiene actualizada automáticamente mediante GitHub Actions:

1. **Setup inicial en EC2**:
   - Instalar Node.js, Git y PM2
   - Clonar el repositorio
   - Configurar variables de entorno
   - Iniciar con PM2

2. **Auto-deployment**:
   - Cada push a `main` activa GitHub Actions
   - GitHub Actions se conecta a EC2 via SSH
   - Ejecuta `git pull` y reinicia la aplicación

3. **Acceso**: `http://<EC2-PUBLIC-IP>`

### Elastic Beanstalk Deployment

Deployment gestionado por AWS:

1. **Crear aplicación en Elastic Beanstalk**
2. **Configurar variables de entorno** en la consola de EB
3. **Deploy** mediante CLI o consola web
4. **Acceso**: `http://<environment-name>.elasticbeanstalk.com`

## API Endpoints

### Productos

- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener un producto específico
- `POST /api/products` - Crear un nuevo producto
- `PUT /api/products/:id` - Actualizar un producto
- `DELETE /api/products/:id` - Eliminar un producto

### Estadísticas

- `GET /api/stats` - Obtener estadísticas del inventario

## 📁 Estructura del Proyecto

```
.
├── server.js              # Servidor Express y conexión a PostgreSQL
├── package.json           # Dependencias del proyecto
├── .env                   # Variables de entorno (no versionado)
├── .gitignore            # Archivos excluidos de Git
├── deploy.sh             # Script de deployment para EC2
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions para auto-deployment
├── public/               # Frontend (PWA)
│   ├── index.html        # Página principal
│   ├── app.js           # Lógica del cliente
│   ├── manifest.json    # Configuración PWA
│   └── sw.js            # Service Worker
└── README.md            # Documentación del proyecto
```

## Modelo de Datos

### Producto

```javascript
{
  id: INTEGER,
  name: TEXT,
  category: TEXT,
  quantity: INTEGER,
  price: REAL,
  description: TEXT,
  created_at: DATETIME,
  updated_at: DATETIME
}
```

## 📊 Datos de Ejemplo

La aplicación crea automáticamente 5 productos de ejemplo al iniciar:

- Laptop Pro (Electronics) - $1,299.99
- Wireless Mouse (Electronics) - $29.99
- Office Chair (Furniture) - $199.99
- Coffee Beans (Food) - $12.99
- Notebook Set (Office Supplies) - $8.99

## 🔐 Seguridad y Configuración

### Variables de Entorno Requeridas

```env
DB_HOST       # Endpoint de RDS PostgreSQL
DB_PORT       # Puerto de PostgreSQL (5432)
DB_NAME       # Nombre de la base de datos
DB_USER       # Usuario de la base de datos
DB_PASSWORD   # Contraseña de la base de datos
DB_SSL        # Usar SSL (true/false)
PORT          # Puerto del servidor (80)
```

### Security Groups AWS

**RDS Security Group** (entrada):
- PostgreSQL (5432) desde EC2 Security Group o VPC

**EC2 Security Group** (entrada):
- SSH (22) desde tu IP
- HTTP (80) desde 0.0.0.0/0
- HTTPS (443) desde 0.0.0.0/0 (opcional)

## 🎓 Propósito Académico

Este proyecto fue desarrollado para AWS Academy con los siguientes objetivos:

1. ✅ **Crear y configurar una base de datos RDS PostgreSQL**
2. ✅ **Desarrollar una aplicación Node.js que se conecte a RDS**
3. ✅ **Desplegar en EC2 con auto-deployment via GitHub Actions**
4. ✅ **Desplegar en Elastic Beanstalk como alternativa**
5. ✅ **Implementar arquitectura de tres capas (DB, App, Infrastructure)**

### Concepto clave
La **aplicación es responsable de la conexión a la base de datos**, mientras que **EC2 y Elastic Beanstalk solo sirven la aplicación web**. Esto permite escalar horizontalmente (múltiples instancias) sin duplicar la gestión de la base de datos.

## 📝 Licencia

ISC
