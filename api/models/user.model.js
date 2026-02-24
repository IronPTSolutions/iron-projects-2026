import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
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
      match: /^https?:\/\/(www\.)?github\.com\/.+$/,
    },
    linkedinUrl: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/,
    },
    location: {
      type: String,
      trim: true,
    },
    languages: {
      type: [String],
    },
    avatarUrl: {
      type: String,
    },
    promotion: {
      type: String,
      match: /^\d{2}\.\d{4}$/,
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
    versionKey: false, // Desactiva el campo __v de versionado de Mongoose
    // Configuración de serialización JSON del documento
    toJSON: {
      virtuals: true, // Incluye campos virtuales (como "id") en la salida JSON
      // Función de transformación para limpiar el JSON de salida
      transform: function (doc, ret) {
        delete ret._id; // Elimina el _id nativo de MongoDB (se usa el virtual "id" en su lugar)
        delete ret.password;
      },
    },
  },
);

userSchema.virtual("sentMessages", {
  ref: "Message",
  localField: "_id",
  foreignField: "sender",
});

userSchema.virtual("receivedMessages", {
  ref: "Message",
  localField: "_id",
  foreignField: "receiver",
});

userSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "author",
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    // bcrypt.hash genera un hash seguro con salt de 10 rondas
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
