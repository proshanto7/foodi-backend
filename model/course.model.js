const mongoose = require("mongoose");
const { Schema } = mongoose;
const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      unique: [true, "Course name already exists"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Course image is required"],
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
    },
    duration: {
      type: Number,
      required: [true, "Course duration is required"],
    },
    students: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: [true, "Slug already exists"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Category is required"],
      ref: "Category",
    },
  },
  { timestamps: true, versionKey: false },
);
module.exports = mongoose.model("Course", courseSchema);
