const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name already exists"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Category", categorySchema);
