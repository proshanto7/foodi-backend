const mongoose = require("mongoose");
const { Schema } = mongoose;
const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Cart", cartSchema);
