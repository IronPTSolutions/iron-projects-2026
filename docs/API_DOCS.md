# Iron Projects — API Documentation

Base URL: `/api`

Todas las rutas (excepto registro, login y logout) requieren sesión autenticada. Las respuestas de error siguen el formato:

```json
{ "message": "Descripción del error" }
```

---

## Autenticación

### `POST /api/sessions` — Iniciar sesión

**Request body:**

```json
{
  "email": "alumno@example.com",
  "password": "s3cret"
}
```

**Response `200`:**

```json
{
  "_id": "664a...",
  "email": "alumno@example.com",
  "name": "Ana García",
  "avatarUrl": "https://res.cloudinary.com/...",
  "promotion": "09.2025"
}
```

**Errores:** `401` credenciales inválidas.

---

### `DELETE /api/sessions` — Cerrar sesión

**Response `204`:** sin cuerpo.

---

## Usuarios

### `POST /api/users` — Registro

**Request body:**

```json
{
  "email": "alumno@example.com",
  "password": "s3cret",
  "inviteCode": "IRONHACK2025"
}
```

**Response `201`:**

```json
{
  "_id": "664a...",
  "email": "alumno@example.com",
  "createdAt": "2025-09-01T10:00:00.000Z",
  "updatedAt": "2025-09-01T10:00:00.000Z"
}
```

**Errores:** `400` datos inválidos · `403` código de invitación incorrecto · `409` email ya registrado.

---

### `PATCH /api/users/me` — Actualizar perfil propio

**Request body** (todos los campos opcionales):

```json
{
  "name": "Ana García",
  "bio": "Fullstack developer apasionada por React",
  "githubUrl": "https://github.com/anagarcia",
  "linkedinUrl": "https://linkedin.com/in/anagarcia",
  "location": "Barcelona",
  "languages": ["ES", "EN"],
  "avatarUrl": "https://res.cloudinary.com/...",
  "promotion": "09.2025"
}
```

**Response `200`:**

```json
{
  "_id": "664a...",
  "email": "alumno@example.com",
  "name": "Ana García",
  "bio": "Fullstack developer apasionada por React",
  "githubUrl": "https://github.com/anagarcia",
  "linkedinUrl": "https://linkedin.com/in/anagarcia",
  "location": "Barcelona",
  "languages": ["ES", "EN"],
  "avatarUrl": "https://res.cloudinary.com/...",
  "promotion": "09.2025",
  "createdAt": "2025-09-01T10:00:00.000Z",
  "updatedAt": "2025-09-02T14:30:00.000Z"
}
```

**Errores:** `400` datos inválidos · `401` no autenticado.

---

### `GET /api/users/:id` — Ver perfil de un alumno

**Response `200`:**

```json
{
  "_id": "664a...",
  "email": "alumno@example.com",
  "name": "Ana García",
  "bio": "Fullstack developer apasionada por React",
  "githubUrl": "https://github.com/anagarcia",
  "linkedinUrl": "https://linkedin.com/in/anagarcia",
  "location": "Barcelona",
  "languages": ["ES", "EN"],
  "avatarUrl": "https://res.cloudinary.com/...",
  "promotion": "09.2025",
  "projects": [
    {
      "_id": "665b...",
      "title": "GameHub",
      "module": 2,
      "images": ["https://res.cloudinary.com/..."],
      "avgRating": 4.2
    }
  ],
  "createdAt": "2025-09-01T10:00:00.000Z",
  "updatedAt": "2025-09-02T14:30:00.000Z"
}
```

**Errores:** `404` usuario no encontrado.

---

## Proyectos

### `POST /api/projects` — Crear proyecto

**Request body:**

```json
{
  "title": "GameHub",
  "description": "Plataforma de juegos online multijugador",
  "module": 2,
  "githubRepo": "https://github.com/anagarcia/gamehub",
  "liveUrl": "https://gamehub.netlify.app",
  "images": ["https://res.cloudinary.com/..."]
}
```

**Response `201`:**

```json
{
  "_id": "665b...",
  "title": "GameHub",
  "description": "Plataforma de juegos online multijugador",
  "module": 2,
  "githubRepo": "https://github.com/anagarcia/gamehub",
  "liveUrl": "https://gamehub.netlify.app",
  "images": ["https://res.cloudinary.com/..."],
  "author": "664a...",
  "promotion": "09.2025",
  "avgRating": 0,
  "createdAt": "2025-09-10T12:00:00.000Z",
  "updatedAt": "2025-09-10T12:00:00.000Z"
}
```

**Errores:** `400` datos inválidos · `401` no autenticado.

---

### `PATCH /api/projects/:id` — Editar proyecto propio

**Request body** (todos los campos opcionales):

```json
{
  "title": "GameHub v2",
  "description": "Descripción actualizada",
  "module": 2,
  "githubRepo": "https://github.com/anagarcia/gamehub-v2",
  "liveUrl": "https://gamehub-v2.netlify.app",
  "images": ["https://res.cloudinary.com/..."]
}
```

**Response `200`:** el proyecto actualizado (mismo formato que en la creación).

**Errores:** `400` datos inválidos · `401` no autenticado · `403` no eres el autor · `404` proyecto no encontrado.

---

### `DELETE /api/projects/:id` — Eliminar proyecto propio

**Response `204`:** sin cuerpo.

**Errores:** `401` no autenticado · `403` no eres el autor · `404` proyecto no encontrado.

---

### `GET /api/projects` — Listar proyectos con filtros

**Query params** (todos opcionales):

| Param       | Tipo   | Ejemplo    | Descripción                   |
| ----------- | ------ | ---------- | ----------------------------- |
| `promotion` | String | `09.2025`  | Filtrar por promoción         |
| `module`    | Number | `2`        | Filtrar por módulo (1, 2, 3)  |
| `author`    | String | `664a...`  | Filtrar por ID de autor       |

**Response `200`:**

```json
[
  {
    "_id": "665b...",
    "title": "GameHub",
    "module": 2,
    "images": ["https://res.cloudinary.com/..."],
    "promotion": "09.2025",
    "avgRating": 4.2,
    "author": {
      "_id": "664a...",
      "name": "Ana García",
      "avatarUrl": "https://res.cloudinary.com/..."
    },
    "createdAt": "2025-09-10T12:00:00.000Z"
  }
]
```

---

### `GET /api/projects/:id` — Ver detalle de un proyecto

**Response `200`:**

```json
{
  "_id": "665b...",
  "title": "GameHub",
  "description": "Plataforma de juegos online multijugador",
  "module": 2,
  "githubRepo": "https://github.com/anagarcia/gamehub",
  "liveUrl": "https://gamehub.netlify.app",
  "images": ["https://res.cloudinary.com/..."],
  "promotion": "09.2025",
  "avgRating": 4.2,
  "author": {
    "_id": "664a...",
    "name": "Ana García",
    "avatarUrl": "https://res.cloudinary.com/..."
  },
  "reviews": [
    {
      "_id": "666c...",
      "comment": "Muy buen proyecto, la UI está genial",
      "rating": 4,
      "author": {
        "_id": "664b...",
        "name": "Carlos López",
        "avatarUrl": "https://res.cloudinary.com/..."
      },
      "createdAt": "2025-09-12T08:00:00.000Z"
    }
  ],
  "createdAt": "2025-09-10T12:00:00.000Z",
  "updatedAt": "2025-09-10T12:00:00.000Z"
}
```

**Errores:** `404` proyecto no encontrado.

---

## Reviews

### `POST /api/projects/:id/reviews` — Crear review sobre un proyecto

**Request body:**

```json
{
  "comment": "Muy buen proyecto, la UI está genial",
  "rating": 4
}
```

**Response `201`:**

```json
{
  "_id": "666c...",
  "comment": "Muy buen proyecto, la UI está genial",
  "rating": 4,
  "author": "664a...",
  "project": "665b...",
  "createdAt": "2025-09-12T08:00:00.000Z"
}
```

**Errores:** `400` datos inválidos o rating fuera de rango (1-5) · `401` no autenticado · `403` no puedes hacer review de tu propio proyecto · `404` proyecto no encontrado · `409` ya has escrito una review para este proyecto.

---

## Mensajería

### `POST /api/users/:id/messages` — Enviar mensaje a un alumno

El `:id` corresponde al receptor del mensaje.

**Request body:**

```json
{
  "subject": "Pregunta sobre tu proyecto M2",
  "body": "Hola! Me encantó tu proyecto. ¿Qué stack usaste para el backend?"
}
```

**Response `201`:**

```json
{
  "_id": "667d...",
  "sender": "664a...",
  "receiver": "664b...",
  "subject": "Pregunta sobre tu proyecto M2",
  "body": "Hola! Me encantó tu proyecto. ¿Qué stack usaste para el backend?",
  "read": false,
  "createdAt": "2025-09-13T09:00:00.000Z"
}
```

**Errores:** `400` datos inválidos · `401` no autenticado · `404` receptor no encontrado.

---

### `GET /api/users/me/messages` — Ver mensajes recibidos

Devuelve los mensajes recibidos por el usuario autenticado, ordenados por fecha descendente. Los mensajes no leídos se marcan como leídos automáticamente al visitarse.

**Response `200`:**

```json
[
  {
    "_id": "667d...",
    "sender": {
      "_id": "664b...",
      "name": "Carlos López",
      "avatarUrl": "https://res.cloudinary.com/..."
    },
    "subject": "Pregunta sobre tu proyecto M2",
    "body": "Hola! Me encantó tu proyecto. ¿Qué stack usaste para el backend?",
    "read": true,
    "createdAt": "2025-09-13T09:00:00.000Z"
  }
]
```

---

### `DELETE /api/messages/:id` — Eliminar mensaje enviado no leído

Solo se puede eliminar un mensaje enviado por el usuario autenticado que aún no haya sido leído por el receptor.

**Response `204`:** sin cuerpo.

**Errores:** `401` no autenticado · `403` no eres el remitente o el mensaje ya fue leído · `404` mensaje no encontrado.
