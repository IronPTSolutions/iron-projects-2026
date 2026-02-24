import mongoose from "mongoose";

// URI de conexión a MongoDB: usa la variable de entorno o la base de datos local por defecto
let MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ironprojects";

// En entorno de pruebas, usa una base de datos separada añadiendo el sufijo "_test"
if (process.env.NODE_ENV === "test") {
  MONGODB_URI += "_test";
}

// Establece la conexión a MongoDB
mongoose
  .connect(MONGODB_URI)
  .then((db) => {
    // Conexión exitosa: muestra el host de la base de datos
    console.log(`MongoDB connected: ${db.connection.host}`);
  })
  .catch((error) => {
    // Error de conexión: muestra el error en consola
    console.error(`error MongoDB`, error);
  });
