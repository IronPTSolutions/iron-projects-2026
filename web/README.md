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

---

### 2. Setup de React Router

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

En `src/App.jsx` definimos las rutas. Separamos dos layouts:

- **Login**: layout centrado a pantalla completa (sin navbar).
- **Rutas autenticadas** (`/*`): layout con `<Navbar />` + contenido en `<main>`.

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/*" element={<AuthenticatedLayout>...</AuthenticatedLayout>} />
</Routes>
```

---

### 3. Contexto de autenticación

Creamos `src/contexts/auth-context.jsx` con un `AuthContext` que:

1. Al montar, llama a `getProfile()` para comprobar si hay sesión activa.
2. Si no hay sesión, redirige a `/login`.
3. Expone `user` y `userLogin()` a toda la app vía contexto.

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

  return (
    <AuthContext.Provider value={{ user, userLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
```

El servicio HTTP (`src/services/api-service.js`) usa Axios con `withCredentials: true` para manejar cookies de sesión contra el backend en `http://localhost:3000/api`.

---

### 4. Página de Login

Creamos `src/pages/login-page.jsx` — un formulario moderno con estética dark/slate + acentos indigo:

- **react-hook-form** para gestión del formulario y validaciones.
- Campos de email y password con iconos inline (SVG).
- Toggle de visibilidad del password (ojo abierto/cerrado).
- Validaciones con mensajes descriptivos (email requerido/formato, password mínimo 6 chars).
- Botón con spinner animado durante el submit (`isSubmitting`).
- Banner de error del servidor si las credenciales son incorrectas.
- Al loguearse con éxito, navega a `/`.

Clases clave utilizadas:

```
bg-slate-800/50 backdrop-blur-xl border-slate-700/50 rounded-2xl
focus:ring-indigo-500/20 focus:border-indigo-500
bg-indigo-500 shadow-indigo-500/25 hover:bg-indigo-400
```

---

### 5. Navbar y Logout

Creamos `src/components/navbar.jsx` — una barra de navegación sticky que comparte la misma paleta visual del login:

- **Sticky** (`sticky top-0 z-50`) con fondo `bg-slate-900/80 backdrop-blur-xl`.
- Logo "IronProjects" con enlace a home y el mismo icono SVG del login.
- Links de navegación: Home, Projects.
- **Menú de usuario** (dropdown):
  - Avatar con la inicial del nombre.
  - Info del usuario (nombre + email).
  - Enlace al perfil.
  - Botón de **Sign out** (en rojo) que llama a `logout()` del api-service y redirige a `/login`.
- **Responsive**: menú hamburguesa en mobile con links colapsados.

---

## Estructura del proyecto

```
src/
├── main.jsx                  # Entry point (BrowserRouter + AuthContext)
├── App.jsx                   # Rutas y layouts
├── index.css                 # Tailwind import
├── assets/
├── components/
│   └── navbar.jsx            # Barra de navegación
├── contexts/
│   └── auth-context.jsx      # Contexto de autenticación
├── pages/
│   ├── home-page.jsx         # Página principal
│   └── login-page.jsx        # Formulario de login
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
