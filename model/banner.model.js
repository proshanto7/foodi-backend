const mongoose = require("mongoose");
const { Schema } = mongoose;

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    highlightedWord: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
  
    bannerImage: {
      type: String,
      required: [true, "banner image is required"],
    },
 
    badgeText: {
      type: String,
    },
   
    buttons: {
      type: Array,
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true , versionKey: false},
);

module.exports = mongoose.model("Banner", bannerSchema);