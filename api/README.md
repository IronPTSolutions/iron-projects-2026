# Iron Projects API

API REST para la plataforma Iron Projects, donde los alumnos de Ironhack pueden registrar sus proyectos, dejar reviews y enviarse mensajes entre ellos.

## Requisitos previos

- Node.js v22+
- MongoDB v7+

## Instalación

```bash
cd api
npm install
```

## Configuración

Copia el archivo de variables de entorno y ajusta los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://127.0.0.1:27017/ironprojects` |
| `COOKIE_SECURE` | Cookie segura (HTTPS) | `false` |

## Ejecución

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```

El servidor arranca en `http://localhost:3000`.

## Estructura del proyecto

```
api/
├── app.js                        # Entrada, middleware stack y arranque
├── config/
│   ├── db.config.js              # Conexión a MongoDB
│   └── routes.config.js          # Definición de rutas
├── controllers/
│   ├── users.controller.js       # Auth, perfil y mensajes
│   └── projects.controller.js    # Proyectos y reviews
├── middlewares/
│   ├── auth.middleware.js        # Validación de sesión por cookie
│   ├── clearbody.middleware.js   # Limpieza de campos protegidos del body
│   └── errors.middleware.js      # Manejo centralizado de errores
└── models/
    ├── user.model.js             # Usuario (bcrypt, virtuals)
    ├── project.model.js          # Proyecto
    ├── review.model.js           # Review (1-5)
    ├── message.model.js          # Mensaje privado
    └── session.model.js          # Sesión de autenticación
```

## Stack técnico

| Paquete | Uso |
|---|---|
| express 5 | Framework HTTP |
| mongoose 9 | ODM para MongoDB |
| bcrypt | Hash de contraseñas (10 rounds) |
| http-errors | Errores HTTP estandarizados |
| morgan | Logging de peticiones |

## Autenticación

La API usa sesiones almacenadas en MongoDB con cookies `httpOnly`.

1. El cliente hace `POST /api/sessions` con email y password.
2. El servidor crea un documento `Session` y devuelve la cookie `sessionId`.
3. Todas las peticiones posteriores envían la cookie automáticamente.
4. `DELETE /api/sessions` elimina la sesión.

**Rutas públicas** (no requieren autenticación):
- `POST /api/users` (registro)
- `POST /api/sessions` (login)

Todas las demás rutas requieren sesión activa.

## Middleware stack

| Orden | Middleware | Función |
|---|---|---|
| 1 | `morgan("dev")` | Logging de peticiones HTTP |
| 2 | `express.json()` | Parseo de JSON en el body |
| 3 | `clearBody` | Elimina `_id`, `createdAt`, `updatedAt` del body |
| 4 | `checkAuth` | Valida sesión y popula `req.session.user` |
| 5 | Router `/api` | Enrutamiento de endpoints |
| 6 | `errorHandler` | Manejo centralizado de errores |

## Modelos

### User

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `email` | String | Sí | Único, lowercase, regex email |
| `password` | String | Sí | Hash bcrypt (excluido en JSON) |
| `name` | String | Sí | Trim |
| `bio` | String | No | Trim |
| `githubUrl` | String | No | Regex `github.com/*` |
| `linkedinUrl` | String | No | Regex `linkedin.com/in/*` |
| `location` | String | No | Trim |
| `languages` | [String] | No | — |
| `avatarUrl` | String | No | — |
| `promotion` | String | No | Formato `XX.YYYY` (ej. `09.2025`) |

**Virtuals:** `projects`, `sentMessages`, `receivedMessages`

### Project

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `title` | String | Sí | Trim |
| `description` | String | Sí | Trim |
| `module` | Number | Sí | Enum: `1`, `2`, `3` |
| `githubRepo` | String | No | Regex `github.com/*` |
| `liveUrl` | String | No | Trim |
| `images` | [String] | No | Máximo 5 elementos |
| `author` | ObjectId → User | Sí | Auto-asignado |
| `promotion` | String | No | Auto-asignado desde el usuario |

**Virtuals:** `reviews`

### Review

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `comment` | String | Sí | Trim |
| `rating` | Number | Sí | Min: 1, Max: 5 |
| `author` | ObjectId → User | Sí | Auto-asignado |
| `project` | ObjectId → Project | Sí | Desde la URL |

Solo genera `createdAt` (sin `updatedAt`).

### Message

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `subject` | String | Sí | Trim |
| `body` | String | Sí | Trim |
| `sender` | ObjectId → User | Sí | Auto-asignado |
| `receiver` | ObjectId → User | Sí | Desde la URL |
| `read` | Boolean | No | Default: `false` |

Solo genera `createdAt` (sin `updatedAt`).

## Endpoints

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/users` | Registro de usuario |
| `POST` | `/api/sessions` | Iniciar sesión |
| `DELETE` | `/api/sessions` | Cerrar sesión |

### Users

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/users/me` | Ver perfil propio (con proyectos y mensajes) |
| `GET` | `/api/users/:id` | Ver perfil de otro alumno (con proyectos) |
| `PATCH` | `/api/users/me` | Actualizar perfil propio |

### Projects

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/projects` | Crear proyecto |
| `GET` | `/api/projects` | Listar proyectos |
| `GET` | `/api/projects/:id` | Detalle de proyecto (con reviews) |
| `PATCH` | `/api/projects/:id` | Editar proyecto |
| `DELETE` | `/api/projects/:id` | Eliminar proyecto (solo autor) |

**Filtros disponibles en `GET /api/projects`:**

| Query param | Ejemplo | Descripción |
|---|---|---|
| `module` | `?module=2` | Filtrar por módulo (1, 2 o 3) |
| `promotion` | `?promotion=09.2025` | Filtrar por promoción |
| `author` | `?author=60f...` | Filtrar por autor |

### Reviews

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/projects/:id/reviews` | Crear review en un proyecto |
| `DELETE` | `/api/projects/:id/reviews/:reviewId` | Eliminar review (solo autor) |

### Messages

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/users/:id/messages` | Enviar mensaje a un alumno |
| `DELETE` | `/api/users/:id/messages/:messageId` | Eliminar mensaje no leído |

## Códigos de respuesta

| Código | Significado | Cuándo |
|---|---|---|
| `200` | OK | GET, PATCH, login |
| `201` | Created | POST (registro, proyectos, reviews, mensajes) |
| `204` | No Content | DELETE exitoso |
| `400` | Bad Request | Validación de Mongoose o campos faltantes |
| `401` | Unauthorized | Sin sesión o credenciales inválidas |
| `403` | Forbidden | Acción no permitida (ej. eliminar proyecto ajeno) |
| `404` | Not Found | Recurso no encontrado o ID inválido |
| `409` | Conflict | Recurso duplicado (ej. email ya registrado) |
| `500` | Internal Server Error | Error inesperado del servidor |

## Formato de respuesta

Todas las respuestas JSON usan `id` como identificador (sin `_id` ni `__v`). El campo `password` nunca se incluye en las respuestas de usuario.

```json
{
  "id": "6654abc...",
  "email": "alumno@example.com",
  "name": "Ana García",
  "createdAt": "2025-09-01T10:00:00.000Z",
  "updatedAt": "2025-09-01T10:00:00.000Z"
}
```

## Postman

La colección `iron-projects.postman_collection.json` incluye todos los endpoints con ejemplos y scripts que auto-guardan los IDs en variables de colección. Importar en Postman y seguir el flujo recomendado: Registro → Login → Perfil → Proyectos → Reviews → Mensajes.
