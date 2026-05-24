import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: String,
      required: [true, 'Please provide a product price (e.g., NPR 1200)'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['slippers', 'clothing', 'collections'],
    },
    subCategory: {
      type: String,
      // For slippers: blockHeel, flat, mediumHeel, smallHeel
      // For clothing: krishnaRadha, pasni, daura, plainKurta, specialKurta, gunya
      // For collections: none/empty
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
