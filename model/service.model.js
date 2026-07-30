const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "icon is required"],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true , versionKey: false}
);

module.exports = mongoose.model("Service", serviceSchema);