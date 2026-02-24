# Iron Projects

Plataforma portfolio para que los alumnos de Ironhack puedan registrar, descubrir y dejar reviews de sus proyectos de módulo.

## Arquitectura

| Carpeta | Descripción | Stack |
|---|---|---|
| `api/` | REST API | Express 5, Mongoose 9, MongoDB |
| `web/` | SPA | React 19, Vite 7, Axios |

## Requisitos previos

- Node.js v22+
- MongoDB v7+

## Instalación rápida

```bash
# API
cd api
cp .env.example .env   # Ajustar variables
npm install
npm run dev             # http://localhost:3000

# Web (en otra terminal)
cd web
npm install
npm run dev             # http://localhost:5173
```

## Variables de entorno (API)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://127.0.0.1:27017/ironprojects` |
| `CORS_ORIGIN` | URL del frontend para CORS | `http://localhost:5173` |
| `VALID_INVITE_CODES` | Códigos de registro (separados por coma) | — |
| `COOKIE_SECURE` | Cookie segura (HTTPS) | `false` |

## Funcionalidades principales

- **Autenticación** — Registro con código de invitación, login/logout con sesiones en cookie `httpOnly`
- **Perfiles** — Cada alumno tiene perfil con bio, links a GitHub/LinkedIn, promoción e idiomas
- **Proyectos** — CRUD de proyectos de módulo (1, 2 o 3) con imágenes, repo y URL de deploy
- **Reviews** — Valoraciones (1-5) y comentarios en proyectos de otros alumnos
- **Mensajes** — Sistema de mensajería directa entre alumnos

## Estructura del proyecto

```
iron-projects/
├── api/
│   ├── app.js                      # Entrada y middleware stack
│   ├── config/
│   │   ├── db.config.js            # Conexión a MongoDB
│   │   └── routes.config.js        # Definición de rutas
│   ├── controllers/
│   │   ├── users.controller.js     # Auth, perfil y mensajes
│   │   └── projects.controller.js  # Proyectos y reviews
│   ├── middlewares/
│   │   ├── auth.middleware.js       # Validación de sesión por cookie
│   │   ├── cors.middleware.js       # Configuración de CORS
│   │   ├── clearbody.middleware.js  # Limpieza de campos protegidos
│   │   └── errors.middleware.js     # Manejo centralizado de errores
│   └── models/
│       ├── user.model.js
│       ├── project.model.js
│       ├── review.model.js
│       ├── message.model.js
│       └── session.model.js
└── web/
    ├── index.html
    ├── vite.config.js
    └── src/
        └── services/
            └── api-service.js       # Cliente HTTP (Axios)
```

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/users` | Registro |
| `POST` | `/api/sessions` | Login |
| `DELETE` | `/api/sessions` | Logout |

### Users
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/users/me` | Perfil propio |
| `GET` | `/api/users/:id` | Perfil de otro alumno |
| `PATCH` | `/api/users/me` | Actualizar perfil |

### Projects
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/projects` | Crear proyecto |
| `GET` | `/api/projects` | Listar proyectos (`?module=`, `?promotion=`, `?author=`) |
| `GET` | `/api/projects/:id` | Detalle de proyecto |
| `PATCH` | `/api/projects/:id` | Editar proyecto |
| `DELETE` | `/api/projects/:id` | Eliminar proyecto |

### Reviews
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/projects/:id/reviews` | Crear review |
| `DELETE` | `/api/projects/:id/reviews/:reviewId` | Eliminar review |

### Messages
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/users/:id/messages` | Enviar mensaje |
| `DELETE` | `/api/users/:id/messages/:messageId` | Eliminar mensaje |
