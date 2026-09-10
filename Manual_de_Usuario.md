# Manual de Usuario
## Sistema de Calificación de Cursos

**Versión:** 1.0  
**Fecha:** 10/09/2026  
**Proyecto:** Prácticas Iniciales — Escuela de Ciencias y Sistemas, USAC

---

## 1. Introducción

El **Sistema de Calificación de Cursos** es una plataforma web orientada a estudiantes de Ciencias y Sistemas. Su propósito es permitir el registro de usuarios, consulta de cursos y catedráticos, publicación de opiniones, comentarios y administración de los cursos aprobados por cada estudiante.

El proyecto está compuesto por:

- Una interfaz web desarrollada con **React + Vite**.
- Una API REST desarrollada con **Node.js + Express**.
- Una base de datos **MySQL**.
- Autenticación mediante **JWT**.

> **Nota importante sobre la versión entregada:** la interfaz que actualmente se encuentra implementada en `frontend/src/components/InformeDashboard.jsx` corresponde a un panel de **Gestión de Informes** y utiliza datos simulados (`mockInformes`) porque `USE_MOCK_DATA` está configurado como `true`. El backend, por su parte, contiene la API del Sistema de Calificación de Cursos. Por lo tanto, las funciones descritas en este manual corresponden a las capacidades implementadas en el repositorio y se indica cuando una función depende de la API.

---

## 2. Requisitos para utilizar el sistema

### 2.1. Requisitos de software

Se recomienda contar con:

- Windows, Linux o macOS.
- Node.js 20 o superior.
- npm.
- MySQL 8.0 o superior.
- Un navegador web actualizado.
- Acceso a la carpeta del proyecto.

### 2.2. Requisitos del proyecto

La estructura principal es:

```text
Informe 3/
├── backend/
│   └── src/
├── frontend/
│   └── src/
├── package-lock.json
└── README.md
```

---

## 3. Inicio del sistema

### 3.1. Preparar la base de datos

1. Iniciar el servidor de MySQL.
2. Crear la base de datos utilizando el archivo:

```text
backend/src/database/database.sql
```

3. Ejecutar el script desde MySQL Workbench, phpMyAdmin o la consola de MySQL.

El script crea la base de datos y las tablas necesarias para:

- Usuarios.
- Cursos.
- Catedráticos.
- Publicaciones.
- Comentarios.
- Cursos aprobados.

### 3.2. Configurar el backend

Abrir una terminal dentro de:

```text
Informe 3/backend
```

Crear el archivo `.env` tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=calificacion_cursos
JWT_SECRET=un_secreto_seguro
```

**Importante:** el nombre de la base de datos definido en `.env` debe coincidir con el nombre utilizado en la base de datos de MySQL.

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Si el servidor inicia correctamente se mostrará un mensaje indicando que se está ejecutando en el puerto configurado.

### 3.3. Iniciar el frontend

Abrir otra terminal dentro de:

```text
Informe 3/frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación. Abrir esa dirección en el navegador.

---

## 4. Uso del panel de Gestión de Informes

La versión actual del frontend muestra el panel **Gestión de Informes**.

La pantalla contiene:

1. Encabezado.
2. Botón **Sincronizar**.
3. Formulario **Nuevo Informe**.
4. Tabla **Listado General**.
5. Contador del total de informes.

### 4.1. Consultar informes

Al abrir la aplicación, el sistema carga automáticamente los informes disponibles.

Mientras se cargan los datos aparece:

```text
Cargando datos...
```

Cuando termina la carga, los registros aparecen en la tabla.

La tabla presenta:

| Campo | Descripción |
|---|---|
| ID | Identificador del informe |
| Título | Nombre del informe |
| Estudiante | Persona responsable |
| Estado | Situación actual del informe |
| Fecha | Fecha registrada |

### 4.2. Crear un informe

Para crear un nuevo informe:

1. Ubicar el panel **Nuevo Informe**.
2. Escribir el título.
3. Escribir el nombre del estudiante.
4. Seleccionar el estado:
   - Pendiente.
   - En Revisión.
   - Aprobado.
5. Presionar **Guardar Informe**.

Los campos **Título** y **Estudiante** son obligatorios.

Después de guardar, el nuevo informe aparece en la tabla y se actualiza el contador.

### 4.3. Sincronizar información

El botón **Sincronizar** vuelve a ejecutar la consulta de informes.

Se puede utilizar cuando se desea volver a cargar la información disponible.

### 4.4. Estados de los informes

Los estados se muestran mediante etiquetas visuales:

- **Pendiente:** el informe todavía no ha sido finalizado.
- **En Revisión:** el informe está siendo revisado.
- **Aprobado:** el informe ha sido aprobado.
- **Completado / En Desarrollo:** también son valores contemplados por la interfaz para registros existentes.

---

## 5. Datos simulados del frontend

Actualmente el archivo:

```text
frontend/src/services/api.js
```

contiene:

```javascript
export const USE_MOCK_DATA = true;
```

Esto significa que la pantalla de Gestión de Informes utiliza los datos definidos en:

```text
frontend/src/mocks/informesMock.js
```

Por esta razón, los informes mostrados actualmente no dependen de MySQL.

Los registros de prueba incluyen ejemplos como:

- Informe 3 - Estructura de Base de Datos y Backend.
- Informe 4 - Interfaz de Usuario e Integración Frontend.
- Calificación de Cursos - Módulo Administrador.

---

## 6. Funcionalidades previstas de la API del sistema

Cuando el frontend se integre completamente con el backend, el usuario autenticado podrá trabajar con:

### Autenticación

- Registro de usuario.
- Inicio de sesión.
- Recuperación de contraseña.
- Consulta del usuario autenticado.

### Cursos

- Consultar todos los cursos.
- Buscar cursos por nombre.
- Consultar un curso específico.

### Catedráticos

- Consultar catedráticos.
- Buscar catedráticos por nombre.
- Consultar un catedrático específico.

### Publicaciones

- Consultar publicaciones.
- Filtrar publicaciones por curso o catedrático.
- Consultar una publicación y sus comentarios.
- Crear publicaciones.

### Comentarios

- Consultar comentarios de una publicación.
- Agregar comentarios.

### Perfil

- Consultar el propio perfil.
- Actualizar nombre y correo.
- Buscar perfiles por registro académico.
- Consultar un perfil mediante registro académico.

### Cursos aprobados

- Consultar cursos aprobados propios.
- Agregar un curso aprobado.
- Eliminar un curso aprobado.
- Consultar cursos aprobados de otro registro académico.

---

## 7. Solución de problemas

### 7.1. La página no abre

Verificar que:

1. El frontend esté ejecutándose con:

```bash
npm run dev
```

2. Se esté utilizando la dirección indicada por Vite.
3. No existan errores en la terminal.

### 7.2. El backend no inicia

Verificar:

- Que Node.js esté instalado.
- Que se haya ejecutado `npm install`.
- Que exista el archivo `.env`.
- Que el puerto configurado no esté siendo utilizado por otro programa.

### 7.3. Error de conexión con MySQL

Verificar:

- MySQL está iniciado.
- `DB_HOST` es correcto.
- `DB_USER` es correcto.
- `DB_PASSWORD` es correcto.
- `DB_NAME` coincide con la base de datos creada.

### 7.4. Error de autenticación

La API utiliza tokens JWT. Las rutas protegidas requieren enviar:

```http
Authorization: Bearer TOKEN
```

Un token inexistente, inválido o expirado genera un error HTTP `401`.

---

## 8. Cierre del sistema

Para detener el frontend o backend:

1. Ir a la terminal donde se está ejecutando.
2. Presionar:

```text
Ctrl + C
```

Esto detiene el proceso correspondiente.

---

## 9. Recomendaciones de uso

- No compartir contraseñas.
- Utilizar un navegador actualizado.
- Mantener MySQL ejecutándose cuando se utilicen funciones que dependen de la base de datos.
- No modificar los archivos `.env` sin conocer su propósito.
- Realizar copias de seguridad de la base de datos antes de hacer cambios importantes.
