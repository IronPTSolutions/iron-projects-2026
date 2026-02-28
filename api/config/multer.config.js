import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

/**
 * Configuración de Multer con Cloudinary como almacenamiento.
 *
 * Multer es un middleware de Express para manejar archivos en peticiones multipart/form-data.
 * En lugar de guardar los archivos en disco local, usa CloudinaryStorage para subirlos
 * directamente a Cloudinary (servicio de gestión de imágenes en la nube).
 *
 * Las credenciales de Cloudinary se configuran mediante variables de entorno.
 */

// Configura el SDK de Cloudinary con las credenciales del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define el almacenamiento: las imágenes se guardan en la carpeta "iron-projects" de Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "iron-projects",
    format: async (req, file) => "jpg",
  },
});

// Crea la instancia de Multer con el almacenamiento de Cloudinary
const upload = multer({ storage: storage });

export default upload;
