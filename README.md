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
│   │   ├── multer.config.js        # Multer + Cloudinary (subida de imágenes)
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
        ├── components/
        │   ├── navbar.jsx            # Barra de navegación con menú de usuario
        │   ├── project-card.jsx      # Tarjeta de proyecto reutilizable
        │   └── profile-projects.jsx  # Proyectos del perfil por módulo
        ├── contexts/
        │   └── auth-context.jsx      # Contexto de autenticación (sesión)
        ├── hooks/
        │   └── use-projects.js       # Hook para obtener lista de proyectos
        ├── pages/
        │   ├── home-page.jsx         # Página principal (grid de proyectos)
        │   ├── login-page.jsx        # Formulario de login
        │   ├── register-page.jsx     # Formulario de registro
        │   └── profile-page.jsx      # Perfil del usuario (editar + proyectos)
        ├── services/
        │   └── api-service.js        # Cliente HTTP (Axios)
        ├── App.jsx                   # Rutas y layouts
        └── main.jsx                  # Entry point (BrowserRouter + AuthProvider)
```

## Cómo hemos construido el proyecto

### 1. Configuración inicial del frontend

Partimos del scaffold de Vite + React y añadimos las dependencias necesarias:

- **react-router-dom** — enrutamiento SPA (rutas públicas y protegidas).
- **react-hook-form** — gestión y validación de formularios.
- **axios** — cliente HTTP con interceptores.
- **tailwindcss** — utilidades CSS para el diseño dark-mode con paleta slate + indigo.

En `web/index.html` configuramos el fondo global con el gradiente oscuro (`bg-linear-to-br from-slate-900 via-slate-800 to-slate-900`).

### 2. Capa de servicios HTTP (`web/src/services/api-service.js`)

Creamos un cliente Axios centralizado con:

- `baseURL` apuntando a `http://localhost:3000/api`.
- `withCredentials: true` para enviar la cookie `sessionId` en cada petición.
- Un **interceptor de respuesta** que desenvuelve `response.data` automáticamente, simplificando el código de los componentes.

Exportamos funciones con nombre descriptivo para cada endpoint: `register`, `login`, `logout`, `getProfile`, `updateProfile`, `updateAvatar`, `listProjects`, `deleteProject`, etc.

### 3. Contexto de autenticación (`web/src/contexts/auth-context.jsx`)

Implementamos un `AuthContextProvider` que:

1. Al montar, hace `GET /api/users/me` para recuperar la sesión activa.
2. Si no hay sesión, redirige automáticamente a `/login`.
3. Mientras verifica la sesión, no renderiza nada (evita flash de contenido protegido).
4. Expone a toda la app: `user`, `userLogin`, `userLogout` y `reloadUser`.

El hook `useAuth()` permite acceder al contexto desde cualquier componente.

### 4. Enrutamiento y layouts (`web/src/App.jsx`)

Definimos dos grupos de rutas:

- **Rutas públicas** (`/login`, `/register`) — layout centrado sin navbar, a pantalla completa.
- **Rutas protegidas** (`/`, `/profile`, catch-all) — envueltas en `AuthenticatedLayout` que incluye el `Navbar` y un `<main>` con ancho máximo (`max-w-6xl`).

La protección de rutas la gestiona el `AuthContextProvider` (punto 3), que redirige al login si no hay sesión.

### 5. Página de Login (`web/src/pages/login-page.jsx`)

Formulario con `react-hook-form` que incluye:

- Validación client-side del email (regex) y password (required).
- Toggle de visibilidad del password con icono ojo abierto/cerrado.
- Spinner en el botón durante el envío (`isSubmitting`).
- Banner de error si las credenciales son incorrectas.
- Footer con enlace a la página de registro.

Al autenticarse correctamente, llama a `userLogin` del contexto y navega a `/`.

### 6. Página de Registro (`web/src/pages/register-page.jsx`)

Formulario similar al login pero con campos adicionales:

- Nombre completo, email, password y **código de invitación**.
- Misma estructura visual (card glassmorphism, iconos en inputs, toggle password).
- Llama a `register()` del servicio API y al completarse navega a `/login`.
- Muestra errores del servidor (código inválido, email duplicado, etc.).

### 7. Navbar (`web/src/components/navbar.jsx`)

Barra de navegación sticky con efecto glassmorphism (`backdrop-blur-xl`):

- Logo "IronProjects" con enlace al home.
- Menú de usuario (dropdown) con: avatar inicial, nombre, email, enlace al perfil y botón de logout.
- Menú hamburguesa en mobile con enlaces a Home y Projects.
- El dropdown se cierra al hacer click fuera (overlay invisible `fixed inset-0`).

### 8. Página Home (`web/src/pages/home-page.jsx`)

Muestra un grid responsive (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) con todos los proyectos:

- Usa el custom hook `useProjects()` para obtener los datos.
- Cada proyecto se renderiza con el componente `ProjectCard`.
- Mientras carga, no muestra nada (loading state).

### 9. Custom hook `useProjects` (`web/src/hooks/use-projects.js`)

Hook reutilizable que:

- Al montar, hace `GET /api/projects` vía `listProjects()`.
- Devuelve `{ projects, loading }` — loading es `true` mientras `projects` es `null`.

### 10. Componente ProjectCard (`web/src/components/project-card.jsx`)

Tarjeta reutilizable que muestra:

- Título del proyecto y badge del módulo.
- Promoción y email del autor.
- Botones de enlace a GitHub y URL en producción.
- Efecto hover con borde indigo.

### 11. Página de Perfil (`web/src/pages/profile-page.jsx`)

Página completa de edición del perfil con dos secciones:

**Sección superior — Formulario de perfil:**
- Avatar con overlay de cámara al hacer hover; click dispara un `<input type="file">` oculto.
- La imagen se sube a Cloudinary vía `updateAvatar()` (FormData con Multer en el backend).
- Campos editables: nombre, ubicación, bio, GitHub URL, LinkedIn URL e idiomas.
- El campo email se muestra como read-only (no editable).
- Los idiomas se introducen como string separado por comas y se convierten a array antes de enviar.

**Sección inferior — Proyectos por módulo:**
- Usa el componente `ProfileProjects` que agrupa los proyectos en 3 columnas (módulos 1, 2 y 3).
- Cada proyecto tiene botón de eliminar con confirmación.
- Si un módulo no tiene proyecto, muestra un placeholder con enlace para crear uno nuevo.

### 12. Subida de avatar con Multer y Cloudinary (API)

En el backend añadimos:

- **`api/config/multer.config.js`** — Configura Multer con `CloudinaryStorage` para subir imágenes directamente a Cloudinary.
- La ruta `PATCH /api/users/me` usa `upload.single("avatar")` como middleware para procesar el archivo.
- En el controlador, si `req.file` existe, se asigna `req.file.path` (URL de Cloudinary) como `avatarUrl`.
- Variables de entorno necesarias: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

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
