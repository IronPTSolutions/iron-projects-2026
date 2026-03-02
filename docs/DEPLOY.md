# Guia de despliegue

Esta guia cubre el despliegue completo del proyecto:

- **API** en [Fly.io](https://fly.io) usando un contenedor Docker
- **Web** en [Netlify](https://netlify.com) como sitio estatico

## Requisitos previos

- Cuenta en [Fly.io](https://fly.io) (tiene plan gratuito)
- Cuenta en [Netlify](https://netlify.com) (tiene plan gratuito)
- [flyctl](https://fly.io/docs/flyctl/install/) instalado
- Base de datos MongoDB accesible desde internet (p.ej. [MongoDB Atlas](https://www.mongodb.com/atlas) gratuito)

---

## 1. Despliegue del API en Fly.io

### 1.1 El Dockerfile

El proyecto ya incluye un `Dockerfile` en `api/`:

```dockerfile
FROM node:25-alpine

WORKDIR /app

COPY package* /app/
RUN npm install --omit=dev

COPY . /app/

CMD ["npm", "start"]
```

Puntos clave:

- Usa `node:25-alpine` para mantener la imagen ligera.
- `--omit=dev` excluye las dependencias de desarrollo.
- Copia primero `package*.json` para aprovechar la cache de capas de Docker (si las dependencias no cambian, no se reinstalan).

El `.dockerignore` excluye `node_modules` para que no se copien al contenedor:

```
node_modules
```

### 1.2 Crear el proyecto en Fly.io

Desde el directorio `api/`:

```bash
cd api
fly launch
```

El CLI te guiara por un asistente interactivo:

1. Te pedira un nombre para la app (o genera uno aleatorio).
2. Selecciona la region mas cercana a tus usuarios (p.ej. `cdg` para Paris, `mad` para Madrid).
3. Detectara el `Dockerfile` automaticamente.
4. **No** necesitas una base de datos de Fly (usaremos MongoDB Atlas).

Esto genera el archivo `fly.toml` con la configuracion del proyecto. Verifica que el puerto interno coincida con el que usa Express:

```toml
[http_service]
  internal_port = 3000
  force_https = true
```

### 1.3 Configurar variables de entorno

Las variables de entorno **secretas** (que no deben estar en el repositorio) se configuran con `fly secrets`:

```bash
fly secrets set MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/ironprojects"
fly secrets set VALID_INVITE_CODES="code1,code2"
fly secrets set CLOUDINARY_CLOUD_NAME="tu-cloud-name"
fly secrets set CLOUDINARY_API_KEY="tu-api-key"
fly secrets set CLOUDINARY_API_SECRET="tu-api-secret"
```

Las variables **no secretas** se pueden poner directamente en `fly.toml` dentro del bloque `[env]`:

```toml
[env]
  COOKIE_SECURE = "true"
  CORS_ORIGIN = "https://tu-app.netlify.app"
```

> `COOKIE_SECURE` debe ser `true` en produccion porque Fly.io sirve por HTTPS.
>
> `CORS_ORIGIN` debe ser la URL exacta de tu web en Netlify (sin barra final).

### 1.4 Desplegar

```bash
fly deploy
```

Fly construira la imagen Docker y la desplegara. Al terminar te mostrara la URL de tu API:

```
https://tu-app-name.fly.dev
```

Comprueba que funciona:

```bash
curl https://tu-app-name.fly.dev/api
```

### 1.5 Comandos utiles de Fly.io

```bash
fly status          # Ver estado de la app
fly logs            # Ver logs en tiempo real
fly secrets list    # Listar secrets configurados
fly ssh console     # Abrir shell en el contenedor
fly apps restart    # Reiniciar la app
```

---

## 2. Despliegue de la Web en Netlify

### 2.1 Configurar la URL del API en Vite

La app usa una variable de entorno de Vite para la URL del API. En `web/src/services/api-service.js`, cambia la `baseURL` del cliente Axios para que use `import.meta.env.VITE_API_URL`:

```js
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});
```

> Vite solo expone variables de entorno que empiezan por `VITE_`. En desarrollo, puedes crear un archivo `web/.env` con:
>
> ```
> VITE_API_URL=http://localhost:3000/api
> ```

### 2.2 Archivo `_redirects`

El proyecto ya incluye `web/public/_redirects` para que Netlify sirva correctamente las rutas de la SPA:

```
/* /index.html 200
```

Esto redirige todas las rutas a `index.html`, necesario para que funcione React Router.

### 2.3 Crear el sitio en Netlify

1. Ve a [app.netlify.com](https://app.netlify.com) y haz clic en **"Add new site" > "Import an existing project"**.
2. Conecta tu repositorio de GitHub/GitLab.
3. Configura el build:
   - **Base directory**: `web`
   - **Build command**: `npm run build`
   - **Publish directory**: `web/dist`
4. En **Environment variables**, anade:

   | Variable       | Valor                             |
   | -------------- | --------------------------------- |
   | `VITE_API_URL` | `https://tu-app-name.fly.dev/api` |

5. Haz clic en **Deploy**.

### 2.4 Despliegue con Netlify CLI (alternativa)

```bash
# Instalar el CLI
npm install -g netlify-cli

# Desde la raiz del proyecto
cd web
npm run build
netlify deploy --prod --dir=dist
```

---

## 3. Conectar API y Web

Una vez ambos esten desplegados, necesitas asegurarte de que se comunican correctamente:

### 3.1 En Fly.io: configurar CORS_ORIGIN

Establece la URL de tu web en Netlify como origen permitido para CORS:

```bash
cd api
fly secrets set CORS_ORIGIN="https://tu-app.netlify.app"
```

O en `fly.toml`:

```toml
[env]
  CORS_ORIGIN = "https://tu-app.netlify.app"
```

> La URL **no debe** tener barra final (`/`). Debe coincidir exactamente con el origen de las peticiones del navegador.

### 3.2 En Netlify: configurar VITE_API_URL

En el panel de Netlify, ve a **Site configuration > Environment variables** y establece:

```
VITE_API_URL = https://tu-app-name.fly.dev/api
```

Despues de cambiar variables de entorno en Netlify, necesitas hacer un nuevo deploy para que surtan efecto (Netlify inyecta las variables en build time):

- Haz push a tu repositorio, o
- En el panel de Netlify: **Deploys > Trigger deploy > Deploy site**

---

## 4. Checklist de despliegue

- [ ] MongoDB Atlas configurado y accesible (IP `0.0.0.0/0` en Network Access para Fly.io)
- [ ] `MONGODB_URI` configurado como secret en Fly.io
- [ ] `CORS_ORIGIN` en Fly.io apunta a la URL de Netlify
- [ ] `COOKIE_SECURE` es `true` en Fly.io
- [ ] `VITE_API_URL` en Netlify apunta a la URL de Fly.io + `/api`
- [ ] `_redirects` existe en `web/public/`
- [ ] Probar registro, login, y navegacion en produccion
- [ ] Verificar que las cookies de sesion se envian correctamente (requiere HTTPS en ambos lados)
