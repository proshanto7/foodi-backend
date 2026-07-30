const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { deleteFile } = require("../helpers/deleteHelper");
const { handleFileUpdate } = require("../helpers/fileUpdateHelper");
const dishModel = require("../model/dish.model");

exports.addDishController = asyncHandler(async (req, res) => {
  const image = req.file?.filename;
  const { name, description, price, rating, category, isFavorite, sortOrder, isActive } = req.body;

  if (!name || !image || !price || !category) {
    if (image) deleteFile(image);
    return apiResponse(res, 400, "name, price, category and dish image are required");
  }

  const dish = new dishModel({
    name,
    description,
    dishImage: `${process.env.UPLOADS_BASE_URL}/${image}`,
    price,
    rating,
    category,
    isFavorite,
    sortOrder,
    isActive,
  });

  await dish.save();
  apiResponse(res, 201, "dish added successfully");
});

exports.findAllDishController = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;

  const dishes = await dishModel
    .find(filter)
    .select("dishImage name description price rating isFavorite sortOrder category")
    .populate("category", "name")
    .sort({ sortOrder: 1, createdAt: -1 });

  apiResponse(res, 200, "dishes fetched successfully", dishes);
});

exports.findSingleDishController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dish = await dishModel.findById(id).populate("category", "name");
  if (!dish) return apiResponse(res, 404, "dish not found");
  apiResponse(res, 200, "dish fetched successfully", dish);
});

exports.deleteDishController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const findDish = await dishModel.findById(id);
  if (!findDish) return apiResponse(res, 404, "dish not found");

  await deleteFile(findDish.dishImage);
  await findDish.deleteOne();

  apiResponse(res, 200, "dish deleted successfully");
});

exports.updateDishController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = req.file?.filename;
  const { name, description, price, rating, category, isFavorite, sortOrder, isActive } = req.body;

  const dish = await dishModel.findById(id);
  if (!dish) {
    if (image) await deleteFile(image);
    return apiResponse(res, 404, "dish not found");
  }

  if (image) {
    dish.dishImage = await handleFileUpdate(dish.dishImage, image);
  }

  if (name) dish.name = name.trim();
  if (description !== undefined) dish.description = description;
  if (price !== undefined) dish.price = price;
  if (rating !== undefined) dish.rating = rating;
  if (category !== undefined) dish.category = category;
  if (isFavorite !== undefined) dish.isFavorite = isFavorite;
  if (sortOrder !== undefined) dish.sortOrder = sortOrder;
  if (isActive !== undefined) dish.isActive = isActive;

  await dish.save();
  apiResponse(res, 200, "dish updated successfully");
});

// toggle favorite (heart icon) — small dedicated endpoint, common for this kind of UI
exports.toggleFavoriteController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dish = await dishModel.findById(id);
  if (!dish) return apiResponse(res, 404, "dish not found");

  dish.isFavorite = !dish.isFavorite;
  await dish.save();

  apiResponse(res, 200, "favorite status updated", { isFavorite: dish.isFavorite });
});