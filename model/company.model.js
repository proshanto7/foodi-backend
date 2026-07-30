const mongoose = require("mongoose");
const { Schema } = mongoose;
const companySchema = new Schema(
  {
    name: {
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
module.exports = mongoose.model("Company", companySchema);
