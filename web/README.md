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

## Estructura del proyecto

```
src/
├── main.jsx                  # Entry point (BrowserRouter + AuthContext)
├── App.jsx                   # Rutas y layouts
├── index.css                 # Tailwind import
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
└── services/
    └── api-service.js        # Cliente HTTP (Axios)
```

---

## Scripts

```bash
npm run dev      # Servidor de desarrollo (Vite)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Lint con ESLint
```
