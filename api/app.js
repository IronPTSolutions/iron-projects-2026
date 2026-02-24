// Importación del framework Express para crear el servidor HTTP
import express from "express";
// Morgan es un logger de peticiones HTTP para desarrollo
import morgan from "morgan";

// Inicializa la conexión a la base de datos MongoDB
import "./config/db.config.js";

// Importa el enrutador principal con todas las rutas de la API
import router from "./config/routes.config.js";

// Importación de middlewares personalizados
import { errorHandler } from "./middlewares/errors.middleware.js";
import { clearBody } from "./middlewares/clearbody.middleware.js";
import { checkAuth } from "./middlewares/auth.middleware.js";
import { cors } from "./middlewares/cors.middleware.js";

// Crea la instancia de la aplicación Express
const app = express();

// Puerto del servidor: usa la variable de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;

// --- Cadena de middlewares (se ejecutan en orden para cada petición) ---

// 1. Logger de peticiones en formato "dev" (método, URL, status, tiempo de respuesta)
app.use(morgan("dev"));
// 2. Configura las cabeceras CORS para permitir peticiones desde el frontend
app.use(cors);
// 3. Parsea el cuerpo de las peticiones con formato JSON
app.use(express.json());
// 4. Limpia campos protegidos del body (_id, createdAt, updatedAt) para evitar manipulación
app.use(clearBody);
// 5. Verifica la autenticación del usuario mediante cookie de sesión
app.use(checkAuth);

// Monta todas las rutas de la API bajo el prefijo /api
app.use("/api", router);

// Middleware final que captura y formatea todos los errores de la aplicación
app.use(errorHandler);

// Inicia el servidor y escucha en el puerto configurado
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
