import bcrypt from "bcrypt";
import mongoose from "mongoose";

// Esquema del modelo de usuario con validaciones y configuración
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Índice único: no permite emails duplicados
      lowercase: true, // Convierte automáticamente a minúsculas
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validación de formato de email
    },
    password: {
      type: String,
      required: true,
      // Se hashea automáticamente en el hook pre-save (ver abajo)
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?github\.com\/.+$/, // Valida que sea una URL de GitHub
    },
    linkedinUrl: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/, // Valida que sea una URL de LinkedIn
    },
    location: {
      type: String,
      trim: true,
    },
    languages: {
      type: [String], // Array de lenguajes de programación
    },
    avatarUrl: {
      type: String,
    },
    promotion: {
      type: String,
      match: /^\d{2}\.\d{4}$/, // Formato de promoción: XX.YYYY (ej: 09.2025)
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
    versionKey: false, // Desactiva el campo __v de versionado de Mongoose
    toJSON: {
      virtuals: true, // Incluye campos virtuales (como "id") en la salida JSON
      transform: function (doc, ret) {
        delete ret._id; // Elimina el _id nativo de MongoDB (se usa el virtual "id" en su lugar)
        delete ret.password; // Nunca exponer la contraseña en las respuestas JSON
      },
    },
  },
);

// --- Relaciones virtuales (no se almacenan en la BD, se calculan al hacer populate) ---

// Mensajes enviados por el usuario
userSchema.virtual("sentMessages", {
  ref: "Message",
  localField: "_id",
  foreignField: "sender",
});

// Mensajes recibidos por el usuario
userSchema.virtual("receivedMessages", {
  ref: "Message",
  localField: "_id",
  foreignField: "receiver",
});

// Proyectos creados por el usuario
userSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "author",
});

// --- Hooks (middleware de Mongoose) ---

// Hook pre-save: hashea la contraseña antes de guardar si fue modificada
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    // bcrypt.hash genera un hash seguro con salt de 10 rondas
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// --- Métodos de instancia ---

// Compara una contraseña en texto plano con el hash almacenado
userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

// Crea y exporta el modelo "User" basado en el esquema
const User = mongoose.model("User", userSchema);

export default User;
