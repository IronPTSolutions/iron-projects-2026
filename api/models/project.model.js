import mongoose from "mongoose";

// Esquema del modelo de proyecto de portafolio
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    module: {
      type: Number,
      required: true,
      enum: [1, 2, 3], // Solo permite módulos 1, 2 o 3 de Ironhack
    },
    githubRepo: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?github\.com\/.+$/, // Valida URL de repositorio GitHub
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    images: {
      type: [String], // Array de URLs de imágenes del proyecto
      validate: {
        validator: (v) => v.length <= 5, // Máximo 5 imágenes por proyecto
        message: "A project can have a maximum of 5 images",
      },
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Referencia al usuario que creó el proyecto
      required: true,
    },
    promotion: {
      type: String,
      match: /^\d{2}\.\d{4}$/, // Formato de promoción: XX.YYYY (se hereda del usuario)
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    versionKey: false, // Desactiva el campo __v
    toJSON: {
      virtuals: true, // Incluye campos virtuales en la salida JSON
      transform: function (doc, ret) {
        delete ret._id; // Usa el virtual "id" en lugar de _id
      },
    },
  },
);

// Relación virtual: reviews asociadas a este proyecto
projectSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "project",
});

// Crea y exporta el modelo "Project"
const Project = mongoose.model("Project", projectSchema);

export default Project;
