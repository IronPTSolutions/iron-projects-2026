/**
 * Middleware CORS (Cross-Origin Resource Sharing).
 * Permite que el frontend (en un dominio diferente) haga peticiones a la API.
 * El origen permitido se configura con la variable de entorno CORS_ORIGIN.
 */
export function cors(req, res, next) {
  // Establece el origen permitido para las peticiones cross-origin
  res.set("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  // Permite todas las cabeceras en las peticiones
  res.set("Access-Control-Allow-Headers", "*");

  // Las peticiones preflight (OPTIONS) se responden inmediatamente sin pasar a las rutas
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  next();
}
