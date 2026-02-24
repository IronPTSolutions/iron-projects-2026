# Iron Projects — API Tasks

Checklist de tareas para implementar el backend de Iron Projects.

---

## 1. Setup del proyecto

- [ ] Inicializar proyecto Node.js (`npm init`)
- [ ] Instalar dependencias: `express`, `mongoose`, `express-session`, `connect-mongo`, `bcrypt`, `cloudinary`, `multer`, `multer-storage-cloudinary`, `cors`, `morgan`, `dotenv`
- [ ] Instalar dependencias de desarrollo: `nodemon`
- [ ] Crear script `dev` con nodemon en `package.json`
- [ ] Crear estructura de carpetas (`models/`, `routes/`, `middlewares/`, `config/`)
- [ ] Crear archivo `.env.example` con las variables necesarias
- [ ] Crear `.gitignore` (node_modules, .env)

## 2. Configuracion

- [ ] Crear `app.js` con configuracion de Express (json parser, cors, morgan, session)
- [ ] Configurar conexion a MongoDB con Mongoose (`config/db.js` o similar)
- [ ] Configurar express-session con connect-mongo como store
- [ ] Configurar CORS para permitir peticiones del frontend (con credentials)
- [ ] Configurar Cloudinary (`config/cloudinary.js`)
- [ ] Crear `.env` local con: `MONGODB_URI`, `SESSION_SECRET`, `INVITE_CODE`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLIENT_ORIGIN`

## 3. Middlewares

- [ ] Middleware `isAuthenticated`: verifica que exista sesion activa, responde 401 si no
- [ ] Configurar multer con Cloudinary storage para subida de imagenes

## 4. Modelo User

- [ ] Definir schema con campos: `email` (unique, required), `password` (required), `name`, `bio`, `githubUrl`, `linkedinUrl`, `location`, `languages` ([String]), `avatarUrl`, `promotion` (formato MM.YYYY)
- [ ] Timestamps activados (`createdAt`, `updatedAt`)
- [ ] No exponer `password` en las respuestas JSON (transform en toJSON o select: false)

## 5. Modelo Project

- [ ] Definir schema con campos: `title` (required), `description` (required), `module` (enum: [1, 2, 3], required), `githubRepo`, `liveUrl`, `images` ([String], max 5), `author` (ref: User, required), `promotion`, `avgRating` (default: 0)
- [ ] Timestamps activados

## 6. Modelo Review

- [ ] Definir schema con campos: `comment` (required), `rating` (required, min: 1, max: 5, entero), `author` (ref: User, required), `project` (ref: Project, required)
- [ ] Timestamps activados (solo `createdAt` necesario)
- [ ] Indice compuesto unique en `{ author, project }` para evitar reviews duplicadas

## 7. Modelo Message

- [ ] Definir schema con campos: `sender` (ref: User, required), `receiver` (ref: User, required), `subject` (required), `body` (required), `read` (default: false)
- [ ] Timestamps activados (solo `createdAt` necesario)

---

## 8. Endpoints — Auth

### `POST /api/sessions` — Iniciar sesion

- [ ] Recibir `email` y `password` en el body
- [ ] Buscar usuario por email
- [ ] Comparar password con bcrypt
- [ ] Guardar usuario en `req.session.userId`
- [ ] Responder 200 con datos del usuario (sin password)
- [ ] Responder 401 si credenciales invalidas

### `DELETE /api/sessions` — Cerrar sesion

- [ ] Destruir la sesion con `req.session.destroy()`
- [ ] Responder 204

---

## 9. Endpoints — Users

### `POST /api/users` — Registro

- [ ] Recibir `email`, `password` e `inviteCode` en el body
- [ ] Validar que `inviteCode` coincida con `process.env.INVITE_CODE` (403 si no)
- [ ] Validar que el email no exista ya (409 si duplicado)
- [ ] Hashear password con bcrypt
- [ ] Crear usuario en DB
- [ ] Responder 201 con datos del usuario (sin password)

### `PATCH /api/users/me` — Actualizar perfil

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Recibir campos opcionales: `name`, `bio`, `githubUrl`, `linkedinUrl`, `location`, `languages`, `avatarUrl`, `promotion`
- [ ] No permitir actualizar `email` ni `password` por esta via
- [ ] Actualizar usuario en DB
- [ ] Responder 200 con usuario actualizado

### `GET /api/users/:id` — Ver perfil

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Buscar usuario por ID
- [ ] Popular sus proyectos (buscar en Project donde author === id)
- [ ] Responder 200 con usuario + proyectos
- [ ] Responder 404 si no existe

---

## 10. Endpoints — Projects

### `POST /api/projects` — Crear proyecto

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Recibir `title`, `description`, `module`, `githubRepo`, `liveUrl`, `images`
- [ ] Asignar `author` desde la sesion
- [ ] Heredar `promotion` del usuario autenticado
- [ ] Validar max 5 imagenes (R9)
- [ ] Crear proyecto en DB
- [ ] Responder 201 con el proyecto creado

### `PATCH /api/projects/:id` — Editar proyecto

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Buscar proyecto por ID
- [ ] Validar que el autor sea el usuario autenticado (403 si no)
- [ ] Actualizar campos permitidos
- [ ] Responder 200 con proyecto actualizado

### `DELETE /api/projects/:id` — Eliminar proyecto

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Buscar proyecto por ID
- [ ] Validar que el autor sea el usuario autenticado (403 si no)
- [ ] Eliminar proyecto y sus reviews asociadas
- [ ] Responder 204

### `GET /api/projects` — Listar proyectos

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Leer query params opcionales: `promotion`, `module`, `author`
- [ ] Construir filtro dinamico con los params presentes
- [ ] Popular campo `author` (name, avatarUrl)
- [ ] Ordenar por fecha descendente
- [ ] Responder 200 con array de proyectos

### `GET /api/projects/:id` — Detalle de proyecto

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Buscar proyecto por ID
- [ ] Popular `author` (name, avatarUrl)
- [ ] Popular `reviews` del proyecto con su `author` (name, avatarUrl)
- [ ] Responder 200 con proyecto + reviews
- [ ] Responder 404 si no existe

---

## 11. Endpoints — Reviews

### `POST /api/projects/:id/reviews` — Crear review

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Recibir `comment` y `rating` en el body
- [ ] Validar que `rating` sea entero entre 1 y 5 (R5)
- [ ] Buscar proyecto por ID (404 si no existe)
- [ ] Validar que el usuario NO sea el autor del proyecto (R4, 403)
- [ ] Validar que no exista review previa del usuario en este proyecto (R3, 409)
- [ ] Crear review en DB
- [ ] Recalcular `avgRating` del proyecto (R6)
- [ ] Responder 201 con la review creada

---

## 12. Endpoints — Messages

### `POST /api/users/:id/messages` — Enviar mensaje

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Recibir `subject` y `body`
- [ ] Validar que el receptor (`:id`) exista (404 si no)
- [ ] Asignar `sender` desde la sesion, `receiver` desde el param
- [ ] Crear mensaje en DB con `read: false`
- [ ] Responder 201 con el mensaje creado

### `GET /api/users/me/messages` — Ver mensajes recibidos

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Buscar mensajes donde `receiver` sea el usuario autenticado
- [ ] Popular `sender` (name, avatarUrl)
- [ ] Ordenar por `createdAt` descendente
- [ ] Marcar como leidos (`read: true`) todos los mensajes no leidos devueltos (R13)
- [ ] Responder 200 con array de mensajes

### `DELETE /api/messages/:id` — Eliminar mensaje enviado

- [ ] Proteger con middleware `isAuthenticated`
- [ ] Buscar mensaje por ID (404 si no existe)
- [ ] Validar que el `sender` sea el usuario autenticado (403 si no)
- [ ] Validar que `read` sea `false` (403 si ya fue leido, R12)
- [ ] Eliminar mensaje de DB
- [ ] Responder 204

---

## 13. Manejo de errores

- [ ] Middleware global de errores al final de `app.js` que capture errores y responda `{ message }` con el status adecuado
- [ ] Manejar errores de validacion de Mongoose (400)
- [ ] Manejar errores de cast de ObjectId invalido (400)
- [ ] Manejar errores de duplicado (11000) para email y review unica (409)

---

## 14. Arranque del servidor

- [ ] Crear `server.js` que conecte a MongoDB y luego levante Express
- [ ] Log de confirmacion de conexion a DB y puerto

---

## 15. Validacion final

- [ ] Probar todos los endpoints con la coleccion Postman (`iron-projects.postman_collection.json`)
- [ ] Verificar que no se expone el password en ninguna respuesta
- [ ] Verificar reglas de negocio R1-R13
- [ ] Verificar codigos de error correctos (400, 401, 403, 404, 409)
