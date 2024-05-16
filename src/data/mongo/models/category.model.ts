import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    deafult: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret, options) => {
    delete ret._id;
  },
});

export const CategoryModel = mongoose.model("Category", categorySchema);
