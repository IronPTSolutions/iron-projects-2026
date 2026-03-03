# Iron Projects — Web

Frontend del proyecto **Iron Projects** construido con React + Vite.

## Stack tecnológico

| Herramienta     | Versión | Descripción             |
| --------------- | ------- | ----------------------- |
| React           | 19      | UI library              |
| Vite            | 7       | Build tool & dev server |
| Tailwind CSS    | 4       | Utility-first CSS       |
| React Router    | 7       | Client-side routing     |
| React Hook Form | 7       | Gestión de formularios  |
| Axios           | 1       | Cliente HTTP            |

---

## Cómo hemos construido el proyecto

### 1. Setup de Tailwind CSS

Partimos de un scaffold de **Vite + React** (con el plugin SWC) y añadimos Tailwind CSS v4:

```bash
npm install tailwindcss @tailwindcss/vite
```

Configuramos el plugin en `vite.config.js`:

```js
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Y en `src/index.css` simplemente importamos Tailwind:

```css
@import "tailwindcss";
```

> En Tailwind v4 ya no se necesita `tailwind.config.js`; la configuración se hace directamente en CSS o vía el plugin de Vite.

En `index.html` configuramos el fondo global con el gradiente oscuro:

```html
<body class="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 h-screen">
```

---

### 2. Capa de servicios HTTP (`src/services/api-service.js`)

Creamos un cliente Axios centralizado con:

- `baseURL` apuntando a `http://localhost:3000/api`.
- `withCredentials: true` para enviar la cookie `sessionId` en cada petición.
- Un **interceptor de respuesta** que desenvuelve `response.data` automáticamente, simplificando el código de los componentes.

```js
const http = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);
```

Exportamos funciones con nombre descriptivo para cada endpoint: `register`, `login`, `logout`, `getProfile`, `updateProfile`, `updateAvatar`, `listProjects`, `deleteProject`, etc.

---

### 3. Setup de React Router

Instalamos `react-router-dom`:

```bash
npm install react-router-dom
```

Envolvemos la aplicación con `<BrowserRouter>` en `src/main.jsx`:

```jsx
<BrowserRouter>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
</BrowserRouter>
```

---

### 4. Contexto de autenticación (`src/contexts/auth-context.jsx`)

Creamos un `AuthContextProvider` que:

1. Al montar, llama a `getProfile()` (`GET /api/users/me`) para comprobar si hay sesión activa.
2. Si no hay sesión, redirige automáticamente a `/login`.
3. Mientras verifica la sesión, no renderiza nada (evita flash de contenido protegido).
4. Expone a toda la app: `user`, `userLogin`, `userLogout` y `reloadUser`.

```jsx
const AuthContext = createContext({});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Intenta recuperar la sesión llamando a GET /api/users/me
    // Si falla → redirige a /login
  }, []);

  async function userLogin(email, password) {
    const user = await login(email, password);
    setUser(user);
  }

  async function userLogout() {
    await logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, userLogin, userLogout, reloadUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

El hook `useAuth()` permite acceder al contexto desde cualquier componente.

---

### 5. Enrutamiento y layouts (`src/App.jsx`)

Definimos dos grupos de rutas:

- **Rutas públicas** (`/login`, `/register`) — layout centrado sin navbar, a pantalla completa.
- **Rutas protegidas** (`/`, `/profile`, catch-all) — envueltas en `AuthenticatedLayout` que incluye el `Navbar` y un `<main>` con ancho máximo (`max-w-6xl`).

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/*" element={
    <AuthenticatedLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthenticatedLayout>
  } />
</Routes>
```

La protección de rutas la gestiona el `AuthContextProvider` (punto 4), que redirige al login si no hay sesión.

---

### 6. Página de Login (`src/pages/login-page.jsx`)

Formulario con `react-hook-form` y estética dark/slate + acentos indigo:

- Validación client-side del email (regex) y password (required).
- Toggle de visibilidad del password con icono ojo abierto/cerrado.
- Spinner en el botón durante el envío (`isSubmitting`).
- Banner de error si las credenciales son incorrectas.
- Footer con enlace a la página de registro.

Al autenticarse correctamente, llama a `userLogin` del contexto y navega a `/`.

Clases clave utilizadas:

```
bg-slate-800/50 backdrop-blur-xl border-slate-700/50 rounded-2xl
focus:ring-indigo-500/20 focus:border-indigo-500
bg-indigo-500 shadow-indigo-500/25 hover:bg-indigo-400
```

---

### 7. Página de Registro (`src/pages/register-page.jsx`)

Formulario similar al login pero con campos adicionales:

- Nombre completo, email, password y **código de invitación**.
- Misma estructura visual (card glassmorphism, iconos en inputs, toggle password).
- Llama a `register()` del servicio API y al completarse navega a `/login`.
- Muestra errores del servidor (código inválido, email duplicado, etc.).

---

### 8. Navbar y Logout (`src/components/navbar.jsx`)

Barra de navegación sticky con efecto glassmorphism (`backdrop-blur-xl`):

- **Sticky** (`sticky top-0 z-50`) con fondo `bg-slate-900/80 backdrop-blur-xl`.
- Logo "IronProjects" con enlace al home y el mismo icono SVG del login.
- **Menú de usuario** (dropdown) con: avatar inicial, nombre, email, enlace al perfil y botón de logout.
- Menú hamburguesa en mobile con enlaces a Home y Projects.
- El dropdown se cierra al hacer click fuera (overlay invisible `fixed inset-0`).

---

### 9. Página Home (`src/pages/home-page.jsx`)

Muestra un grid responsive (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) con todos los proyectos:

- Usa el custom hook `useProjects()` para obtener los datos.
- Cada proyecto se renderiza con el componente `ProjectCard`.
- Mientras carga, no muestra nada (loading state).

```jsx
const { projects, loading } = useProjects();

if (loading) return <></>;

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {projects.map((project) => (
      <ProjectCard project={project} key={project.id} />
    ))}
  </div>
);
```

---

### 10. Custom hook `useProjects` (`src/hooks/use-projects.js`)

Hook reutilizable que:

- Al montar, hace `GET /api/projects` vía `listProjects()`.
- Devuelve `{ projects, loading }` — loading es `true` mientras `projects` es `null`.

```js
export default function useProjects() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    async function fetch() {
      const projects = await listProjects();
      setProjects(projects);
    }
    fetch();
  }, []);

  return { projects, loading: projects === null };
}
```

---

### 11. Componente ProjectCard (`src/components/project-card.jsx`)

Tarjeta reutilizable que muestra:

- Título del proyecto y badge del módulo (1, 2 o 3).
- Promoción y email del autor.
- Botones de enlace a GitHub y URL en producción.
- Efecto hover con borde indigo.

---

### 12. Página de Perfil (`src/pages/profile-page.jsx`)

Página completa de edición del perfil con dos secciones:

**Sección superior — Formulario de perfil:**
- Avatar con overlay de cámara al hacer hover; click dispara un `<input type="file">` oculto.
- La imagen se sube a Cloudinary vía `updateAvatar()` (FormData con Multer en el backend).
- Campos editables: nombre, ubicación, bio, GitHub URL, LinkedIn URL e idiomas.
- El campo email se muestra como read-only (no editable).
- Los idiomas se introducen como string separado por comas y se convierten a array antes de enviar.

```jsx
const payload = {
  ...data,
  languages: data.languages.split(",").map((l) => l.trim()).filter(Boolean),
};
const updated = await updateProfile(payload);
reloadUser({ ...user, ...updated });
```

**Sección inferior — Proyectos por módulo (`ProfileProjects`):**
- Agrupa los proyectos en 3 columnas, una por módulo (1, 2 y 3).
- Cada proyecto tiene botón de eliminar con confirmación (`confirm()`).
- Si un módulo no tiene proyecto, muestra un placeholder con enlace para crear uno nuevo.
- Al eliminar, actualiza el estado global del usuario sin recargar la página.

---

### 13. Subida de avatar con Multer y Cloudinary (API)

En el backend añadimos soporte para la subida de imágenes:

- **`api/config/multer.config.js`** — Configura Multer con `CloudinaryStorage` para subir imágenes directamente a Cloudinary (sin guardar en disco).
- La ruta `PATCH /api/users/me` usa `upload.single("avatar")` como middleware para procesar el archivo.
- En el controlador, si `req.file` existe, se asigna `req.file.path` (URL de Cloudinary) como `avatarUrl`.
- Variables de entorno necesarias: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

```js
// multer.config.js
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "iron-projects", format: async () => "jpg" },
});
const upload = multer({ storage });
```

---

### 14. Filtros de proyectos (`src/components/projects-filters.jsx`)

Componente de filtrado integrado en la página Home:

- **Filtro por módulo** — select con opciones 1, 2, 3 o "All".
- **Filtro por promoción** — select con las promociones disponibles.
- **Búsqueda por autor** — input de texto con icono de lupa.
- **Botón Clear** — resetea todos los filtros a vacío.

Los filtros se gestionan como estado en `HomePage` y se pasan como props:

```jsx
const [filters, setFilters] = useState({ module: "", promotion: "", author: "" });
<ProjectsFilters filters={filters} setFilters={setFilters} />
```

---

### 15. Skeleton de carga (`src/components/project-card-skeleton.jsx`)

Componente placeholder con `animate-pulse` que replica la estructura de `ProjectCard`. Se muestra mientras los proyectos están cargando, creando un efecto de carga suave:

```jsx
{loading
  ? Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
  : projects.map((project) => <ProjectCard ... />)}
```

---

### 16. Hook `useProjects` actualizado con filtros y debounce

El hook ahora acepta un objeto `filters` y reacciona a cambios en él:

- Si el filtro `author` tiene valor, aplica un **debounce de 500 ms** para no bombardear la API mientras el usuario escribe.
- Al cambiar cualquier filtro, resetea `projects` a `null` (muestra skeletons) y lanza la petición con los filtros como query params.
- Limpia el timeout en el cleanup del efecto.

```js
export default function useProjects(filters) {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const timer = filters.author ? 500 : 0;
    const timeout = window.setTimeout(async () => {
      setProjects(null);
      const projects = await listProjects(filters);
      setProjects(projects);
    }, timer);
    return () => window.clearTimeout(timeout);
  }, [filters]);

  return { projects, loading: projects === null };
}
```

---

### 17. Página de detalle de proyecto (`src/pages/project-page.jsx`)

Página completa para ver un proyecto individual (ruta `/projects/:id`):

- **Hero section** — título, badges de módulo y promoción, rating medio con estrellas.
- **Galería de imágenes** — muestra la primera imagen del proyecto.
- **Descripción** del proyecto.
- **Botones de acción** — enlaces a GitHub y Live URL.
- **Sección de autor** — usa el componente `ProjectAuthorCard`.
- **Sección de reviews** — lista todas las reviews con `ProjectReview`.
- **Loading state** — skeleton animado mientras carga.

Usa el custom hook `useProject()` que obtiene un proyecto por su ID desde la URL.

---

### 18. Hook `useProject` (`src/hooks/use-project.js`)

Similar a `useProjects` pero para un único proyecto:

- Extrae el `id` de los params de la URL con `useParams()`.
- Hace `GET /api/projects/:id` vía `getProject(id)`.
- Devuelve `{ project, loading }`.

```js
export default function useProject() {
  const [project, setProject] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetch() {
      const project = await getProject(id);
      setProject(project);
    }
    fetch();
  }, [id]);

  return { project, loading: project === null };
}
```

---

### 19. Componente `ProjectAuthorCard` (`src/components/project-author-card.jsx`)

Tarjeta reutilizable que muestra la información del autor de un proyecto:

- Avatar, nombre con enlace al perfil (`/users/:id`) y email.
- Badges de ubicación y promoción.
- Bio del autor.
- Tags de idiomas/tecnologías.
- Enlaces sociales a GitHub y LinkedIn con iconos.

---

### 20. Componente `ProjectReview` (`src/components/project-review.jsx`)

Tarjeta de review individual que muestra:

- Avatar y nombre del autor (con enlace a su perfil) y su promoción.
- Rating con estrellas (componente `StarRating`).
- Texto del comentario.
- Fecha de creación formateada.

---

### 21. Componente `StarRating` (`src/components/start-rating.jsx`)

Componente de estrellas visual que recibe un `rating` (1-5) y renderiza 5 estrellas SVG, coloreando en ámbar las que corresponden a la puntuación:

```jsx
{[1, 2, 3, 4, 5].map((star) => (
  <svg className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-slate-600"}`} ...>
```

---

### 22. Página de usuario (`src/pages/user-page.jsx`)

Perfil público de cualquier usuario (ruta `/users/:id`):

- **Profile card** — avatar grande (rounded-2xl), nombre, email, ubicación, bio, idiomas, enlaces sociales (GitHub, LinkedIn) y fecha de registro.
- **Sección de proyectos** — grid con los proyectos del usuario usando `ProjectCard`.
- **Loading state** — skeleton animado.

Usa el custom hook `useUser()`.

---

### 23. Hook `useUser` (`src/hooks/user-user.js`)

Hook para obtener un usuario por ID:

- Extrae el `id` de `useParams()`.
- Hace `GET /api/users/:id` vía `getUser(id)`.
- Devuelve `{ user, loading }`.

---

### 24. Nuevas rutas en `App.jsx`

Se añadieron dos nuevas rutas protegidas:

```jsx
<Route path="/projects/:id" element={<ProjectPage />} />
<Route path="/users/:id" element={<UserPage />} />
```

---

### 25. Nuevos endpoints en `api-service.js`

Se ampliaron las funciones del servicio HTTP:

- `getProject(id)` — `GET /api/projects/:id` (detalle de proyecto).
- `getUser(id)` — `GET /api/users/:id` (perfil público de usuario).
- `createReview(projectId, review)` — `POST /api/projects/:id/reviews`.
- `deleteReview(projectId, reviewId)` — `DELETE /api/projects/:id/reviews/:id`.
- `sendMessage(userId, message)` — `POST /api/users/:id/messages`.
- `deleteMessage(userId, messageId)` — `DELETE /api/users/:id/messages/:id`.
- `listProjects(filters)` — ahora acepta filtros como query params.

El `baseURL` se configura dinámicamente según el host:

```js
baseURL: location.host === "iron-projects.netlify.app"
  ? "https://api-ancient-paper-8537.fly.dev/api"
  : "http://localhost:3000/api",
```

---

### 26. Despliegue en Netlify (`public/_redirects`)

Para que React Router funcione correctamente en Netlify (SPA con client-side routing), añadimos el fichero `public/_redirects`:

```
/* /index.html 200
```

Esta regla redirige todas las peticiones al `index.html`, permitiendo que React Router gestione las rutas en el navegador.

---

### 27. Formulario de review (`src/components/review-form.jsx`)

Componente para añadir reviews a los proyectos:

- Botón toggle "Write Review" / "Cancel" para mostrar/ocultar el formulario.
- **Selector de estrellas interactivo** (1-5) con efecto hover — cada estrella cambia de color al pasar el ratón (`onMouseEnter`/`onMouseLeave`).
- Al seleccionar rating > 0, aparece un textarea para el comentario.
- Se envía pulsando **Enter** dentro del textarea (`onKeyUp`).
- Tras enviar, resetea el rating a 0 y recarga el proyecto con `reloadProject()`.

```jsx
const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);

// Estrellas con color dinámico según hover o selección
{[1, 2, 3, 4, 5].map((star) => (
  <button
    onMouseEnter={() => setHoverRating(star)}
    onMouseLeave={() => setHoverRating(0)}
    onClick={() => setRating(star)}
  >
    <svg className={star <= (hoverRating || rating) ? "text-amber-400" : "text-slate-600"} />
  </button>
))}
```

---

### 28. Sistema de mensajería — Hook `useMessages` (`src/hooks/use-messages.js`)

Hook que gestiona las conversaciones del usuario autenticado:

1. Obtiene los mensajes enviados y recibidos vía `getProfile()`.
2. **Agrupa los mensajes por "el otro usuario"** usando un objeto `grouped`.
3. Ordena los mensajes dentro de cada conversación por fecha ascendente.
4. Ordena las conversaciones por último mensaje (más reciente primero).
5. Calcula el contador de mensajes no leídos (`unread`) por conversación.
6. **Polling cada 5 segundos** (`setInterval`) para actualizar en tiempo real.
7. Función `markAsRead` que marca todos los mensajes no leídos de una conversación.

```js
const grouped = {};
for (const msg of allMessages) {
  const isSender = (msg.sender?.id || msg.sender) === myId;
  const otherUser = isSender ? msg.receiver : msg.sender;
  // Agrupa por ID del otro usuario
  grouped[otherId].messages.push({ ...msg, isMine: isSender });
}
```

Devuelve: `{ conversations, unreadCount, loading, refresh, markAsRead }`.

---

### 29. Página de chat (`src/pages/chat-page.jsx`)

Página con layout de dos paneles para la mensajería:

- **Panel izquierdo** — `ConversationList`: lista de conversaciones con avatar, nombre, preview del último mensaje y badge de no leídos.
- **Panel derecho** — `ChatView`: mensajes de la conversación activa con input para enviar.
- Al seleccionar una conversación, navega a `/chat/:userId` y marca los mensajes como leídos.
- Usa `useMemo` para encontrar la conversación activa sin recalcular en cada render.
- Layout full-height con márgenes negativos para ocupar toda la pantalla.

```jsx
<Route path="/chat" element={<ChatPage />} />
<Route path="/chat/:userId" element={<ChatPage />} />
```

---

### 30. Componentes del chat

**`ConversationItem`** — Item individual de la lista de conversaciones:
- Avatar (imagen o inicial), nombre, timestamp relativo ("hace 5m", "ayer").
- Preview del último mensaje truncado a 50 caracteres.
- Badge indigo con mensajes no leídos.
- Borde izquierdo indigo cuando está seleccionado.

**`ChatView`** — Vista del chat activo:
- Header con avatar y nombre del otro usuario (enlace al perfil).
- Lista de mensajes con auto-scroll al último.
- Input con envío al pulsar Enter.
- Estado vacío si no hay conversación seleccionada.

**`MessageBubble`** — Burbuja de mensaje individual:
- Mensajes propios alineados a la derecha (fondo indigo), ajenos a la izquierda (fondo slate).
- Botón de eliminar visible al hover (solo mensajes propios no leídos).
- Popover de confirmación antes de eliminar.

**`ConversationList`** — Wrapper que renderiza la lista de `ConversationItem` con estado vacío.

---

### 31. Navbar — icono de chat con badge de no leídos

Se añadió al navbar un **icono de chat** con badge indicador de mensajes no leídos:

- Icono de burbuja de chat con enlace a `/chat`.
- **Polling cada 15 segundos** para contar mensajes no leídos vía `getProfile()`.
- Badge circular con el contador (solo visible si > 0).

```jsx
useEffect(() => {
  async function fetchUnread() {
    const profile = await getProfile();
    const count = profile.receivedMessages.filter(m => !m.read).length;
    setUnreadCount(count);
  }
  fetchUnread();
  const interval = setInterval(fetchUnread, 15000);
  return () => clearInterval(interval);
}, [user]);
```

---

### 32. Comentarios de código

Se añadieron **JSDoc y comentarios educativos** a todos los archivos del proyecto:

- Configuraciones: `vite.config.js`, `eslint.config.js`, `index.css`.
- Páginas: `project-page.jsx`, `user-page.jsx`, `chat-page.jsx`.
- Componentes: `project-author-card.jsx`, `project-review.jsx`, `review-form.jsx`, `projects-filters.jsx`, `start-rating.jsx`, `chat-view.jsx`, `conversation-item.jsx`, `conversation-list.jsx`, `message-bubble.jsx`.
- Hooks: `use-project.js`, `user-user.js`.

Cada archivo incluye una descripción JSDoc del componente/hook, sus responsabilidades, props que recibe y comportamiento principal.

---

## Estructura del proyecto

```
public/
├── _redirects                    # Netlify SPA redirect rule
src/
├── main.jsx                      # Entry point (BrowserRouter + AuthContext)
├── App.jsx                       # Rutas y layouts
├── index.css                     # Tailwind import
├── components/
│   ├── navbar.jsx                # Barra de navegación con menú de usuario y badge chat
│   ├── project-card.jsx          # Tarjeta de proyecto reutilizable
│   ├── project-card-skeleton.jsx # Skeleton loading para ProjectCard
│   ├── project-author-card.jsx   # Tarjeta de autor en detalle de proyecto
│   ├── project-review.jsx        # Tarjeta de review individual
│   ├── review-form.jsx           # Formulario de review con selector de estrellas
│   ├── projects-filters.jsx      # Filtros de módulo, promoción y autor
│   ├── start-rating.jsx          # Estrellas de valoración (1-5, solo lectura)
│   ├── profile-projects.jsx      # Proyectos del perfil por módulo
│   ├── chat-view.jsx             # Vista del chat activo (mensajes + input)
│   ├── conversation-item.jsx     # Item individual de conversación
│   ├── conversation-list.jsx     # Lista de conversaciones
│   └── message-bubble.jsx        # Burbuja de mensaje (propio/ajeno + eliminar)
├── contexts/
│   └── auth-context.jsx          # Contexto de autenticación (sesión)
├── hooks/
│   ├── use-projects.js           # Hook para listar proyectos (con filtros y debounce)
│   ├── use-project.js            # Hook para obtener un proyecto por ID
│   ├── use-messages.js           # Hook de mensajería (conversaciones + polling)
│   └── user-user.js              # Hook para obtener un usuario por ID
├── pages/
│   ├── home-page.jsx             # Página principal (filtros + grid de proyectos)
│   ├── login-page.jsx            # Formulario de login
│   ├── register-page.jsx         # Formulario de registro
│   ├── profile-page.jsx          # Perfil del usuario (editar + proyectos)
│   ├── project-page.jsx          # Detalle de proyecto (hero + autor + reviews)
│   ├── user-page.jsx             # Perfil público de usuario
│   └── chat-page.jsx             # Página de chat (dos paneles)
└── services/
    └── api-service.js            # Cliente HTTP (Axios) con baseURL dinámica
```

---

## Scripts

```bash
npm run dev      # Servidor de desarrollo (Vite)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Lint con ESLint
```
