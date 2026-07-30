const cartModel = require("../model/cart.model");
const courseModel = require("../model/course.model");
const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

exports.addToCartController = asyncHandler(async (req, res) => {
  const { courseId, quantity } = req.body;
  const userId = req.user.safeData._id;
  const course = await courseModel.findById(courseId);
  if (!course) return apiResponse(res, 404, "course not found");

  const cart = new cartModel({
    userId,
    courseId,
  });
  await cart.save();
  apiResponse(res, 200, "course added to cart successfully", cart);
});

exports.getCartController = asyncHandler(async (req, res) => {
  const userId = req.user.safeData._id;
  const cart = await cartModel
    .find({ userId })
    .populate("courseId", "name image price")
    .select("courseId quantity");
  apiResponse(res, 200, "cart fetched successfully", cart);
});

exports.deleteCartController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cart = await cartModel.findById(id);
  if (!cart) return apiResponse(res, 404, "cart not found");
  await cart.deleteOne();
  apiResponse(res, 200, "cart deleted successfully", cart);
  
});
