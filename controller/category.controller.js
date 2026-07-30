const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { deleteFile } = require("../helpers/deleteHelper");
const { handleFileUpdate } = require("../helpers/fileUpdateHelper");
const categoryModel = require("../model/category.model");

exports.addCategoryController = asyncHandler(async (req, res) => {
  const image = req.file?.filename;
  const { name, itemCount, sortOrder, isActive } = req.body;

  if (!name || !image) {
    if (image) deleteFile(image);
    return apiResponse(res, 400, "name and category image are required");
  }

  const category = new categoryModel({
    name,
    categoryImage: `${process.env.UPLOADS_BASE_URL}/${image}`,
    itemCount,
    sortOrder,
    isActive,
  });

  await category.save();
  apiResponse(res, 200, "category added successfully");
});

exports.findAllCategoryController = asyncHandler(async (req, res) => {
  const category = await categoryModel
    .find({})
    .select("categoryImage name itemCount sortOrder isActive")
    .sort({ sortOrder: 1, createdAt: -1 });
  apiResponse(res, 200, "category fetched successfully", category);
});

exports.findSingleCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) return apiResponse(res, 404, "category not found");
  apiResponse(res, 200, "category fetched successfully", category);
});

exports.deleteCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const findCategory = await categoryModel.findById(id);
  if (!findCategory) return apiResponse(res, 404, "category not found");

  // delete file from uploads folder
  await deleteFile(findCategory.categoryImage);
  // delete category from database
  await findCategory.deleteOne();
  apiResponse(res, 200, "category deleted successfully");
});

exports.updateCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = req.file?.filename;
  const { name, itemCount, sortOrder, isActive } = req.body;

  const category = await categoryModel.findById(id);
  if (!category) {
    if (image) {
      await deleteFile(image);
    }
    return apiResponse(res, 404, "category not found");
  }

  // update category image: delete old file from uploads folder and set new one
  if (image) {
    category.categoryImage = await handleFileUpdate(category.categoryImage, image);
  }

  if (name !== undefined) category.name = name;
  if (itemCount !== undefined) category.itemCount = itemCount;
  if (sortOrder !== undefined) category.sortOrder = sortOrder;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();
  apiResponse(res, 200, "category updated successfully");
});