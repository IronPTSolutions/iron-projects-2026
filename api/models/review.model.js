import mongoose from "mongoose";

// Esquema del modelo de review (valoración) de un proyecto
const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Puntuación mínima: 1 estrella
      max: 5, // Puntuación máxima: 5 estrellas
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Referencia al usuario que escribió la review
      required: true,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project", // Referencia al proyecto valorado
      required: true,
    },
  },
  {
    // Solo genera createdAt (las reviews no se pueden editar, por eso no necesitan updatedAt)
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  },
);

// Crea y exporta el modelo "Review"
const Review = mongoose.model("Review", reviewSchema);

export default Review;
