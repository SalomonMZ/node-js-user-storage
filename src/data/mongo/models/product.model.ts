import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  available: {
    type: Boolean,
    deafult: false,
  },
  price: {
    type: Number,
    deafult: 0,
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret, options) => {
    delete ret._id
  }
})

export const ProductModel = mongoose.model("Product", productSchema);
