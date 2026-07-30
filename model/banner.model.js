const mongoose = require("mongoose");
const { Schema } = mongoose;

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      required: [true, "image is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Banner", bannerSchema);
