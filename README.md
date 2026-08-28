# Sistema de Calificación de Cursos

Plataforma web para que los estudiantes de Ciencias y Sistemas publiquen, evalúen y consulten opiniones sobre catedráticos y cursos.

Proyecto de Prácticas Iniciales — Escuela de Ciencias y Sistemas, USAC.

## Integrantes
- Nombre 1 — Carné
- Nombre 2 — Carné

## Stack tecnológico
- **Frontend:** React 18+ (Vite)
- **Backend:** Node.js 20+ / Express (REST API)
- **Base de datos:** MySQL 8.0+
- **Control de versiones:** Git & GitHub

## Estructura del repositorio
```
/frontend   -> Aplicación React (SPA)
/backend    -> API REST en Express
/docs       -> Manual de Usuario, Manual Técnico, diagrama E-R
```

## Cómo correr el proyecto localmente

### Backend
```bash
cd backend
cp .env.example .env   # y llena tus credenciales de MySQL
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Flujo de trabajo en Git
- `main` siempre debe quedar estable.
- Cada integrante trabaja en su propia rama: `feature/nombre-del-modulo`.
- Se integra a `main` mediante Pull Request.
- Commits frecuentes e individuales (se evalúa el historial).

## Entregables
- [ ] Manual de Usuario
- [ ] Manual Técnico (arquitectura, diagrama E-R, especificación de endpoints)
- [ ] Repositorio de GitHub con accesos concedidos al equipo docente

**Fecha límite:** 10/09/2026
