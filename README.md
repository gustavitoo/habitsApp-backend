# 🧩 Aplicación de Hábitos (BACKEND) — NestJS + TypeORM + PostgreSQL + RabbitMQ

## 📘 Descripción general

Este proyecto implementa una arquitectura de **microservicios** desarrollada con **NestJS**, orientada a la autenticación y gestión de usuarios.  
Actualmente cuenta con:

- **API Gateway** → punto de entrada principal que comunica los clientes con los microservicios internos.
- **Auth Service** → responsable de la autenticación (registro, login, emisión de tokens JWT).
- **Users Service** → maneja la persistencia y lógica de usuarios (creación, validación, consulta en base de datos).

El sistema utiliza **RabbitMQ** como broker de mensajes para comunicación entre microservicios y **PostgreSQL** como base de datos principal.  
El flujo actual permite **registrar y autenticar usuarios**, devolviendo un **token JWT** válido al frontend.

---

## 🏗️ Arquitectura del proyecto

```
/apps
 ├── api-gateway/        # Puerta de entrada HTTP (NestJS)
 ├── auth-service/       # Manejo de autenticación, JWT, y login/registro
 └── users-service/      # CRUD y lógica de usuarios (almacenamiento en DB)
/libs
 └── common/             # Código compartido: DTOs, helpers, excepciones, utils, etc.
```

### 🧠 Flujo general

1. El cliente (frontend) realiza una petición HTTP al **API Gateway** (`/auth/register` o `/auth/login`).
2. El **API Gateway** reenvía la solicitud mediante RPC (RabbitMQ) al **Auth Service**.
3. El **Auth Service** coordina la lógica de negocio:
   - Valida el cuerpo de la petición.
   - Contacta al **Users Service** para crear o validar credenciales.
   - Genera y retorna un **JWT token** si el proceso es exitoso.
4. El **API Gateway** recibe la respuesta, maneja posibles errores (via `RpcException`) y envía la respuesta final al cliente.

---

## ⚙️ Tecnologías utilizadas

| Tecnología | Uso principal |
|-------------|----------------|
| **NestJS** | Framework principal para crear microservicios |
| **TypeORM** | ORM para la conexión con PostgreSQL |
| **PostgreSQL** | Base de datos relacional principal |
| **RabbitMQ** | Broker de mensajes para comunicación entre microservicios |
| **bcrypt** | Hash de contraseñas seguras |
| **JWT (jsonwebtoken)** | Generación y validación de tokens de sesión |
| **Docker / Docker Compose** | Orquestación de contenedores para desarrollo y despliegue |
| **concurrently** | Ejecución paralela de microservicios en desarrollo |
| **dotenv** | Manejo de variables de entorno |
| **class-validator / class-transformer** | Validación de DTOs |

---

## 🧰 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

| Requisito | Versión recomendada |
|------------|--------------------|
| **Node.js** | >= 18.x |
| **pnpm** | >= 9.x |
| **Docker & Docker Compose** | Última versión estable |
| **PostgreSQL (opcional)** | Si deseas correr la base localmente sin Docker |
| **RabbitMQ (opcional)** | Si no usas Docker Compose |

---

## 🚀 Instalación y configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/gustavitoo/habitsApp-backend.git
cd habitsApp-backend
```

---

### 2️⃣ Instalar dependencias

```bash
pnpm install
```

---

### 3️⃣ Configurar variables de entorno

Actualmente los servicios apuntan a un sólo servidor, entonces tenemos un sólo archivo *.env*:

```env
# 🌐 App
API_GATEWAY_PORT=3000
API_GATEWAY_ENV=development

# 🗄️ PostgreSQL
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=mypassword
DB_NAME=habits_app

# 📦 RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# ⚙️ TypeORM
DB_SYNCHRONIZE=true
DB_LOGGING=true

# 🔐 JWT
JWT_SECRET=super_secret_key
```

---

### 4️⃣ Levantar los servicios con Docker

El proyecto incluye un `docker-compose.yml` que levanta:
- PostgreSQL  
- RabbitMQ  
- Todos los microservicios (gateway, auth y users) **[EN PROCESO]**

```bash
docker compose up --build
```

Esto levantará todo el entorno con un solo comando 🚀  
Accede a:
- **API Gateway** → [http://localhost:3000](http://localhost:3000)  
- **RabbitMQ panel** → [http://localhost:15672](http://localhost:15672) (user: guest / pass: guest)

---

### 5️⃣ Levantar en entorno local

Puedes ejecutar todos los microservicios con `concurrently`:

```bash
npm run start:all
```

Este comando ejecuta:

```json
"start:all": "concurrently --names \"GATEWAY,AUTH,USERS\" --prefix-colors \"blue,magenta,green\" \"npm run start:gateway\" \"npm run start:auth\" \"npm run start:users\""
```

Verás los logs coloridos de cada servicio en tiempo real 🧠

---

## 🔑 Endpoints actuales

### Registro
```
POST /auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

**Respuesta:**
```json
{
  "message": "Usuario creado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

## 🧱 Próximos pasos / Roadmap

- 🔹 Endpoint `/profile` (propio o por ID, con control de roles)
- 🔹 Middleware global de autorización (JWT + Roles)
- 🔹 Integración con un frontend (React, Vite)
- 🔹 Logging distribuido y trazabilidad (e.g. Winston / OpenTelemetry)
- 🔹 Monitoreo y métricas con Prometheus + Grafana
- 🔹 Test unitarios y e2e por microservicio (Jest)

---

## 🧾 Licencia
Este proyecto está bajo licencia **MIT**.