/**
 * Middleware CORS (Cross-Origin Resource Sharing).
 * Permite que el frontend (en un dominio diferente) haga peticiones a la API.
 * El origen permitido se configura con la variable de entorno CORS_ORIGIN.
 */
export function cors(req, res, next) {
  // Establece el origen permitido para las peticiones cross-origin
  res.set("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);

  // Permite el envío de Cookies en las peticiones de cross-origin
  res.set("Access-Control-Allow-Credentials", "true");

  res.set("Access-Control-Allow-Headers", "content-type");

  res.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");

  // Las peticiones preflight (OPTIONS) se responden inmediatamente sin pasar a las rutas
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  next();
}
