export function cors(req, res, next) {
  res.set("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.set("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  next();
}
