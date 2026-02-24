import mongoose from "mongoose";

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
      enum: [1, 2, 3],
    },
    githubRepo: {
      type: String,
      trim: true,
      match: /^https?:\/\/(www\.)?github\.com\/.+$/,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 5,
        message: "A project can have a maximum of 5 images",
      },
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    promotion: {
      type: String,
      match: /^\d{2}\.\d{4}$/,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  },
);

projectSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "project",
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
