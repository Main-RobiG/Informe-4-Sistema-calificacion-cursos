# Manual Técnico
## Sistema de Calificación de Cursos

**Versión:** 1.0  
**Fecha:** 10/09/2026  
**Proyecto:** Prácticas Iniciales — Escuela de Ciencias y Sistemas, USAC

---

## 1. Objetivo

Este documento describe la arquitectura, instalación, configuración, estructura del código, base de datos, autenticación y API REST del proyecto **Sistema de Calificación de Cursos**.

El repositorio contiene dos componentes principales:

- `frontend`: aplicación web construida con React y Vite.
- `backend`: API REST construida con Node.js y Express.

La persistencia de datos se realiza mediante MySQL.

---

## 2. Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React 19 | Construcción de la interfaz |
| Vite | Servidor de desarrollo y empaquetado del frontend |
| React Router DOM | Dependencia disponible para navegación |
| Node.js | Ejecución del backend |
| Express | Framework HTTP para la API |
| MySQL 8+ | Base de datos relacional |
| mysql2 | Conexión Node.js ↔ MySQL |
| bcryptjs | Hash y comparación de contraseñas |
| jsonwebtoken | Autenticación mediante JWT |
| cors | Comunicación entre frontend y backend |
| dotenv | Variables de entorno |
| Nodemon | Reinicio automático durante desarrollo |
| Git | Control de versiones |

---

## 3. Arquitectura

La solución sigue una arquitectura cliente-servidor:

```text
┌──────────────────────────────┐
│          Navegador           │
│      React + Vite            │
└──────────────┬───────────────┘
               │ HTTP/JSON
               ▼
┌──────────────────────────────┐
│       Backend Express        │
│          Node.js             │
├──────────────────────────────┤
│ Routes                       │
│ Controllers                  │
│ Services                     │
│ Models                       │
│ Middleware JWT               │
└──────────────┬───────────────┘
               │ SQL
               ▼
┌──────────────────────────────┐
│            MySQL             │
│ sistema_calificacion_cursos  │
└──────────────────────────────┘
```

---

## 4. Estructura del proyecto

```text
Informe 3/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── seed.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       ├── database/
│       │   ├── connection.js
│       │   └── database.sql
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── models/
│       ├── routes/
│       └── services/
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       ├── mocks/
│       └── services/
│
└── README.md
```

---

## 5. Backend

### 5.1. Punto de entrada

El archivo utilizado por los scripts principales es:

```text
backend/src/app.js
```

El `package.json` define:

```json
"dev": "nodemon src/app.js",
"start": "node src/app.js"
```

Por lo tanto:

```bash
npm run dev
```

ejecuta `src/app.js`.

> El repositorio también contiene `src/index.js`, que configura otra versión de las rutas. Para ejecutar el proyecto según los scripts actuales se debe utilizar `app.js`.

---

## 6. Configuración del backend

El archivo de referencia:

```text
backend/.env.example
```

contiene:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=calificacion_cursos
JWT_SECRET=cambia_esto_por_un_secreto_seguro
```

Se recomienda crear:

```text
backend/.env
```

y definir valores reales.

### Variables

| Variable | Descripción |
|---|---|
| `PORT` | Puerto HTTP del backend |
| `DB_HOST` | Host de MySQL |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `JWT_SECRET` | Secreto utilizado para firmar JWT |
| `JWT_EXPIRES_IN` | Duración opcional del token |

**Importante:** el archivo `database.sql` crea la base de datos `sistema_calificacion_cursos`, mientras que `.env.example` propone `calificacion_cursos`. Ambos valores deben unificarse antes de ejecutar el sistema.

---

## 7. Capas del backend

El backend se divide en varias capas.

### 7.1. Routes

Los archivos de `routes/` definen:

- Método HTTP.
- URL.
- Middleware.
- Controller correspondiente.

### 7.2. Controllers

Los controllers reciben la solicitud HTTP, llaman al servicio correspondiente y devuelven la respuesta.

### 7.3. Services

Los services contienen la lógica de negocio.

Ejemplos:

```text
auth.service.js
course.service.js
professor.service.js
post.service.js
comment.service.js
profile.service.js
approvedCourse.service.js
```

### 7.4. Models

Los modelos ejecutan consultas SQL contra MySQL.

### 7.5. Middleware

`auth.middleware.js` valida el JWT antes de permitir acceso a las rutas protegidas.

---

## 8. Base de datos

La base de datos definida en:

```text
backend/src/database/database.sql
```

contiene las siguientes tablas:

```text
users
courses
professors
posts
comments
approved_courses
```

### 8.1. users

Almacena los usuarios.

Campos principales:

```text
id
academic_registry
full_name
email
password_hash
created_at
updated_at
```

Restricciones:

- `academic_registry` es único.
- `email` es único.
- La contraseña se almacena mediante hash.

### 8.2. courses

Almacena los cursos.

```text
id
code
name
credits
semester
```

`code` es único.

Los créditos no pueden ser negativos y el semestre debe encontrarse entre 1 y 10 cuando se proporciona.

### 8.3. professors

Almacena los catedráticos:

```text
id
full_name
created_at
```

### 8.4. posts

Almacena las publicaciones.

```text
id
user_id
course_id
professor_id
content
created_at
```

Una publicación debe estar relacionada con **un curso o un catedrático, pero no con ambos**.

### 8.5. comments

Almacena comentarios:

```text
id
post_id
user_id
content
created_at
```

### 8.6. approved_courses

Relaciona usuarios con cursos aprobados:

```text
id
user_id
course_id
approved_at
```

Existe una restricción única:

```text
(user_id, course_id)
```

Esto evita registrar dos veces el mismo curso aprobado para un usuario.

---

## 9. Relaciones de la base de datos

```text
USERS
  │
  ├──────────────< POSTS >────────────── COURSES
  │                    │
  │                    └────────────── PROFESSORS
  │
  ├──────────────< COMMENTS >────────── POSTS
  │
  └──────────────< APPROVED_COURSES >── COURSES
```

Relaciones principales:

- Un usuario puede crear muchas publicaciones.
- Un usuario puede crear muchos comentarios.
- Una publicación pertenece a un usuario.
- Una publicación pertenece a un curso o a un catedrático.
- Un comentario pertenece a una publicación y a un usuario.
- Un usuario puede tener varios cursos aprobados.
- Un curso puede aparecer como aprobado por varios usuarios.

---

## 10. Autenticación

La autenticación utiliza:

- `bcryptjs` para contraseñas.
- `jsonwebtoken` para tokens.

### Registro

```http
POST /api/auth/register
```

Body:

```json
{
  "academicRegistry": "202012345",
  "fullName": "Nombre del estudiante",
  "email": "estudiante@example.com",
  "password": "123456"
}
```

El sistema valida que todos los campos existan y que el registro académico y correo no estén registrados.

### Inicio de sesión

```http
POST /api/auth/login
```

Body:

```json
{
  "academicRegistry": "202012345",
  "password": "123456"
}
```

Respuesta exitosa:

```json
{
  "token": "JWT...",
  "user": {
    "id": 1,
    "academicRegistry": "202012345",
    "fullName": "Nombre del estudiante",
    "email": "estudiante@example.com"
  }
}
```

### Recuperación de contraseña

```http
POST /api/auth/recover-password
```

Body:

```json
{
  "academicRegistry": "202012345",
  "email": "estudiante@example.com",
  "newPassword": "nueva_clave"
}
```

### Usuario autenticado

```http
GET /api/auth/me
```

Requiere:

```http
Authorization: Bearer <token>
```

---

## 11. Middleware JWT

El middleware:

```text
backend/src/middleware/auth.middleware.js
```

comprueba:

1. Que exista `Authorization`.
2. Que tenga formato `Bearer TOKEN`.
3. Que el token sea válido.
4. Que el token no haya expirado.

Cuando la validación es correcta, los datos decodificados se almacenan en:

```javascript
req.user
```

Si falla:

```http
401 Unauthorized
```

---

## 12. Especificación de endpoints

Todas las rutas siguientes están implementadas en `app.js`.

### 12.1. Autenticación

| Método | Endpoint | Auth | Función |
|---|---|---:|---|
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| POST | `/api/auth/recover-password` | No | Actualizar contraseña |
| GET | `/api/auth/me` | Sí | Obtener usuario autenticado |

### 12.2. Cursos

| Método | Endpoint | Auth | Función |
|---|---|---:|---|
| GET | `/api/courses` | Sí | Listar cursos |
| GET | `/api/courses?search=texto` | Sí | Buscar cursos por nombre |
| GET | `/api/courses/:id` | Sí | Obtener curso |

### 12.3. Catedráticos

| Método | Endpoint | Auth | Función |
|---|---|---:|---|
| GET | `/api/professors` | Sí | Listar catedráticos |
| GET | `/api/professors?search=texto` | Sí | Buscar por nombre |
| GET | `/api/professors/:id` | Sí | Obtener catedrático |

### 12.4. Publicaciones

| Método | Endpoint | Auth | Función |
|---|---|---:|---|
| GET | `/api/posts` | Sí | Listar publicaciones |
| GET | `/api/posts?courseId=1` | Sí | Filtrar por curso |
| GET | `/api/posts?professorId=1` | Sí | Filtrar por catedrático |
| GET | `/api/posts/:id` | Sí | Obtener publicación y comentarios |
| POST | `/api/posts` | Sí | Crear publicación |

Body para crear publicación sobre un curso:

```json
{
  "courseId": 1,
  "content": "Comentario sobre el curso."
}
```

Body para crear publicación sobre un catedrático:

```json
{
  "professorId": 1,
  "content": "Opinión sobre el catedrático."
}
```

No se deben enviar `courseId` y `professorId` simultáneamente.

### 12.5. Comentarios

| Método | Endpoint | Auth | Función |
|---|---|---:|---|
| GET | `/api/posts/:postId/comments` | Sí | Listar comentarios |
| POST | `/api/posts/:postId/comments` | Sí | Agregar comentario |

Body:

```json
{
  "content": "Texto del comentario."
}
```

### 12.6. Perfiles

| Método | Endpoint | Auth | Función |
|---|---|---:|---|
| GET | `/api/profiles/me` | Sí | Consultar perfil propio |
| PUT | `/api/profiles/me` | Sí | Actualizar perfil |
| GET | `/api/profiles/search?academicRegistry=2020` | Sí | Buscar perfiles |
| GET | `/api/profiles/:academicRegistry` | Sí | Consultar perfil |

Body para actualizar:

```json
{
  "fullName": "Nuevo nombre",
  "email": "nuevo@example.com"
}
```

### 12.7. Cursos aprobados

| Método | Endpoint | Auth | Función |
|---|---|---:|---|
| GET | `/api/profiles/me/approved-courses` | Sí | Cursos aprobados propios |
| POST | `/api/profiles/me/approved-courses` | Sí | Agregar curso aprobado |
| DELETE | `/api/profiles/me/approved-courses/:courseId` | Sí | Eliminar curso aprobado |
| GET | `/api/profiles/:academicRegistry/approved-courses` | Sí | Consultar cursos aprobados de un usuario |

Body para agregar:

```json
{
  "courseId": 1
}
```

La respuesta incluye los cursos y el total de créditos:

```json
{
  "courses": [],
  "totalCredits": 0
}
```

---

## 13. Códigos HTTP utilizados

| Código | Significado |
|---:|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Solicitud inválida |
| 401 | No autenticado o token inválido |
| 404 | Recurso no encontrado |
| 409 | Conflicto, por ejemplo registro o correo duplicado |
| 500 | Error interno del servidor |

---

## 14. Frontend

El frontend utiliza React.

Archivo principal:

```text
frontend/src/App.jsx
```

Actualmente renderiza:

```jsx
<InformeDashboard />
```

El componente principal está en:

```text
frontend/src/components/InformeDashboard.jsx
```

### Componentes

- `InformeDashboard.jsx`: pantalla principal de gestión de informes.
- `TablaInformes.jsx`: componente de tabla reutilizable.
- `InformeDashboard.module.css`: estilos del dashboard.

### Servicios

```text
frontend/src/services/api.js
frontend/src/services/informeService.js
```

`informeService.js` contiene:

- `getInformes()`
- `createInforme()`

### Datos simulados

```text
frontend/src/mocks/informesMock.js
```

El frontend está configurado actualmente con:

```javascript
USE_MOCK_DATA = true
```

Por lo tanto, la pantalla de informes no consume actualmente los endpoints de la API de cursos.

---

## 15. Flujo de datos del dashboard actual

```text
Usuario
   │
   ▼
InformeDashboard.jsx
   │
   ▼
informeService.js
   │
   ├── USE_MOCK_DATA = true
   │          │
   │          ▼
   │   informesMock.js
   │
   └── USE_MOCK_DATA = false
              │
              ▼
           fetch()
              │
              ▼
          API REST
```

Al iniciar el componente se ejecuta `getInformes()` mediante `useEffect`.

Al crear un informe se ejecuta `createInforme()`.

---

## 16. Instalación completa

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 17. Comandos disponibles

### Backend

```bash
npm run dev
```

Ejecuta el backend con Nodemon.

```bash
npm start
```

Ejecuta el backend con Node.js.

```bash
npm run seed
```

Ejecuta el script de carga inicial definido en `src/seed.js`.

### Frontend

```bash
npm run dev
```

Inicia Vite.

```bash
npm run build
```

Genera la versión de producción.

```bash
npm run preview
```

Sirve localmente la compilación de producción.

```bash
npm run lint
```

Ejecuta ESLint.

---

## 18. Pruebas manuales recomendadas

### Comprobar backend

Abrir:

```text
http://localhost:4000/
```

La API debe devolver:

```json
{
  "message": "API Sistema de Calificación de Cursos funcionando"
}
```

### Probar registro

Enviar:

```http
POST /api/auth/register
Content-Type: application/json
```

con:

```json
{
  "academicRegistry": "202012345",
  "fullName": "Usuario de Prueba",
  "email": "prueba@example.com",
  "password": "123456"
}
```

### Probar login

Enviar:

```http
POST /api/auth/login
Content-Type: application/json
```

con las credenciales creadas.

Guardar el token recibido para probar las rutas protegidas.

---

## 19. Seguridad

El proyecto implementa varias medidas:

- Contraseñas almacenadas mediante `bcryptjs`.
- Tokens firmados mediante JWT.
- Rutas protegidas mediante middleware.
- Uso de variables de entorno para secretos y credenciales.
- Restricciones de integridad referencial en MySQL.
- Restricciones `UNIQUE` para evitar duplicados.

Para producción se recomienda:

- Utilizar un `JWT_SECRET` largo y aleatorio.
- No subir `.env` al repositorio.
- Configurar CORS con dominios permitidos en lugar de una política abierta.
- Utilizar HTTPS.
- Validar y sanitizar entradas de usuario.
- Implementar recuperación de contraseña mediante un mecanismo seguro de correo electrónico.

---

## 20. Mantenimiento

### Agregar un endpoint

1. Crear o modificar el modelo.
2. Agregar la lógica al service.
3. Crear el método del controller.
4. Registrar la ruta.
5. Probar el endpoint.
6. Integrarlo con el frontend.

### Modificar la base de datos

1. Realizar copia de seguridad.
2. Modificar `database.sql`.
3. Actualizar los modelos afectados.
4. Revisar las relaciones y restricciones.
5. Probar las operaciones relacionadas.

### Modificar la interfaz

Los componentes React se encuentran en:

```text
frontend/src/components/
```

Los estilos principales del dashboard están en:

```text
frontend/src/components/InformeDashboard.module.css
```

---

## 21. Control de versiones

El README del proyecto establece el siguiente flujo:

- `main` debe permanecer estable.
- Cada integrante trabaja en una rama propia.
- Las ramas siguen el formato:

```text
feature/nombre-del-modulo
```

- La integración se realiza mediante Pull Request.
- Se recomienda realizar commits frecuentes e individuales.

---

## 22. Observaciones técnicas de la versión actual

1. El backend tiene dos archivos de entrada (`app.js` e `index.js`), pero los scripts de `package.json` utilizan `app.js`.
2. `app.js` expone las rutas principales de cursos, catedráticos, publicaciones, comentarios, perfiles y cursos aprobados.
3. `frontend/src/services/api.js` tiene `API_BASE_URL` apuntando a `http://localhost:5000/api`, mientras que el backend del proyecto utiliza por defecto el puerto `4000`. Si se conecta el frontend real a este backend, ambas configuraciones deben coincidir.
4. El frontend de Gestión de Informes utiliza actualmente `USE_MOCK_DATA = true`, por lo que trabaja con datos simulados.
5. El nombre de base de datos del archivo `.env.example` (`calificacion_cursos`) no coincide con el nombre creado en `database.sql` (`sistema_calificacion_cursos`). Debe corregirse uno de los dos antes de conectar el backend.
6. El archivo `frontend/src/services/informeService.js` consulta `/api/informes` cuando se desactiva el modo mock, pero esa ruta no está definida en `backend/src/app.js`. Para una integración real de este dashboard se necesitaría implementar dicha ruta o adaptar el frontend a los endpoints existentes.

---

## 23. Conclusión

El proyecto cuenta con una arquitectura separada entre frontend, backend y base de datos. El backend implementa una API REST con autenticación JWT y una estructura por capas de rutas, controladores, servicios y modelos.

La base de datos contiene las entidades principales necesarias para usuarios, cursos, catedráticos, publicaciones, comentarios y cursos aprobados.

La interfaz frontend actualmente presenta un dashboard de Gestión de Informes con datos simulados. Para convertirlo en una aplicación completamente integrada con la API de calificación de cursos es necesario alinear el frontend con los endpoints implementados, corregir el puerto de la API y unificar el nombre de la base de datos en la configuración.
