const { deleteFile } = require("../helpers/deleteHelper");
const { fileUpdateHelper } = require("../helpers/fileUpdateHelper");
const categoryModel = require("../model/category.model");
const courseModel = require("../model/course.model");
const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

exports.addCategoryController = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;
  const image = req.file?.filename;

  const existsCategory = await categoryModel.findOne({ name });
  if (existsCategory) {
    deleteFile(image);
    return apiResponse(res, 409, "category already exists");
  }
  if (!name) {
    deleteFile(image);
    return apiResponse(res, 400, "category name is required");
  }
  const category = new categoryModel({
    name,
    image: `${process.env.UPLOADS_BASE_URL}/${image}`,
    isActive,
  });
  await category.save();
  apiResponse(res, 200, "category added successfully", category);
});

exports.findAllCategoryController = asyncHandler(async (req, res) => {
  const category = await categoryModel
    .find({})
    .select("name image isActive")
    .populate("courses", "name -_id")
    .sort({ createdAt: -1 });


  apiResponse(res, 200, "category fetched successfully", category);
});

exports.updateCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;
  const image = req.file?.filename;

  const category = await categoryModel.findById(id);
  if (!category) return apiResponse(res, 404, "category not found");
  // delete old file from uploads folder and update new file in uploads folder
  if (image) category.image = await fileUpdateHelper(category.image, image);
  if (name) category.name = name;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();
  apiResponse(res, 200, "category updated successfully", category);
});

exports.deleteCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) return apiResponse(res, 404, "category not found");

  const allCourses = await courseModel.find({ category: category._id });

  await Promise.all(
    allCourses.map(async (course) => {
      deleteFile(course.image);
      await courseModel.deleteOne({ _id: course._id });
    }),
  );

  deleteFile(category.image);
  await category.deleteOne();
  apiResponse(res, 200, "category deleted successfully", category);
});
