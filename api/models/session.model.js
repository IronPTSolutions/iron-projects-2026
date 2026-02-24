import mongoose from "mongoose";

// Esquema del modelo de sesión para autenticación basada en cookies
const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Referencia al usuario autenticado; permite usar .populate("user")
    },
  },
  {
    timestamps: true, // createdAt indica cuándo se inició la sesión
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id; // Usa el virtual "id" en lugar de _id
      },
    },
  },
);

// Crea y exporta el modelo "Session"
const Session = mongoose.model("Session", sessionSchema);

export default Session;
