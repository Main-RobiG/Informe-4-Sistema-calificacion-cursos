# Sistema de Calificación de Cursos

Plataforma web para que los estudiantes de la Escuela de Ciencias y Sistemas (USAC) consulten y compartan opiniones sobre cursos y catedráticos, como alternativa estructurada a los grupos de Facebook.

## Integrantes y roles

| Integrante | Carné | Rol en el proyecto |
|---|---|---|
| Rudin Alexander López Salvatierra | 200919744 | Backend (API REST, base de datos, autenticación) |
| Sergio Roberto Gudiel Sian | 201404365 | Frontend (interfaz de usuario, React/Vite) |

## ¿Qué hace el sistema?

- Registro e inicio de sesión de estudiantes, con recuperación de contraseña.
- Muro de publicaciones sobre cursos o catedráticos, con filtros por curso, catedrático o texto.
- Comentarios en cada publicación.
- Búsqueda y visualización de perfiles de otros estudiantes por registro académico.
- Perfil propio editable (nombre y correo; el carné no se puede modificar).
- Gestión de cursos aprobados por el estudiante, con cálculo automático de créditos acumulados.

## Arquitectura

Arquitectura cliente-servidor de tres capas:

```
Frontend (React 18+ / Vite)  ──HTTPS/REST (JSON)──▶  Backend (Node.js 20+ / Express)  ──SQL (mysql2)──▶  MySQL 8.0
```

- **Frontend:** React + Vite, enrutamiento con `react-router-dom`, autenticación por JWT guardado en `localStorage`, consumo de la API mediante un helper `apiRequest` (`src/api/api.js`).
- **Backend:** Express, arquitectura en capas `routes → controllers → services/models`, JWT con `jsonwebtoken` y contraseñas hasheadas con `bcryptjs`.
- **Base de datos:** MySQL 8.0 mediante `mysql2/promise` con *connection pooling*.

### Modelo de datos

Entidades principales: `users`, `courses`, `professors`, `posts`, `comments`, `approved_courses`.

Reglas clave:
- Cada publicación (`posts`) pertenece **exclusivamente** a un curso o a un catedrático, nunca a ambos.
- Un usuario no puede repetir un curso aprobado (`approved_courses` tiene restricción única `user_id + course_id`).
- Eliminación en cascada desde `posts`, `comments` y `approved_courses` hacia sus tablas padre.

## Estructura de rutas

### API (backend) — Base URL: `http://localhost:3000/api`

| Módulo | Rutas principales |
|---|---|
| Autenticación | `POST /auth/register`, `POST /auth/login`, `POST /auth/recover-password`, `GET /auth/me` 🔒 |
| Catálogos | `GET /courses`, `GET /courses/:id`, `GET /professors`, `GET /professors/:id` 🔒 |
| Publicaciones | `GET /posts`, `GET /posts/:id`, `POST /posts`, `GET/POST /posts/:postId/comments` 🔒 |
| Perfiles | `GET/PUT /profiles/me`, `GET /profiles/search`, `GET /profiles/:academicRegistry`, `GET/POST/DELETE /profiles/me/approved-courses` 🔒 |

🔒 = requiere header `Authorization: Bearer <token>`

### Frontend

| Ruta | Página | Protegida |
|---|---|---|
| `/login` | Inicio de sesión | No |
| `/register` | Registro de usuario | No |
| `/recover-password` | Recuperar contraseña | No |
| `/home` | Muro de publicaciones + filtros | Sí |
| `/posts/new` | Crear publicación | Sí |
| `/posts/:id` | Detalle de publicación + comentarios | Sí |
| `/profile` | Perfil propio | Sí |
| `/profile/:academicRegistry` | Perfil de un tercero (solo lectura) | Sí |

## Instalación y ejecución

### Requisitos previos
- Node.js 20+
- MySQL 8.0

### 1. Base de datos

```bash
mysql -u root -p < backend/src/database/database.sql
```

> ⚠️ No ejecutar de nuevo este script si ya existen datos, ya que crea las tablas desde cero.

### 2. Backend

```bash
cd backend
cp .env.example .env      # edita DB_PASSWORD y JWT_SECRET
npm install
npm run seed               # carga usuarios de prueba + catálogo de cursos y catedráticos
npm run dev                 # http://localhost:3000
```

Variables de entorno (`backend/.env`):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sistema_calificacion_cursos
DB_PORT=3306
PORT=3000
JWT_SECRET=cambia_esto_por_un_secreto_seguro
JWT_EXPIRES_IN=8h
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

Variables de entorno (`frontend/.env`):

```
VITE_API_URL=http://localhost:3000/api
```

## Documentación adicional

- [Manual Técnico](./Manual_Tecnico.md) — detalle de arquitectura, modelo entidad-relación y especificación completa de endpoints.
- [Manual de Usuario](./Manual_Usuario.md) — guía de uso de la plataforma paso a paso, con capturas de pantalla.
