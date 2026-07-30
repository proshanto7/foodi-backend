const { deleteFile } = require("../helpers/deleteHelper");
const { fileUpdateHelper } = require("../helpers/fileUpdateHelper");
const categoryModel = require("../model/category.model");
const courseModel = require("../model/course.model");
const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const createSlug = require("../utils/createSlug");

exports.addCourseController = asyncHandler(async (req, res) => {
  const { name, price, duration, isActive, students, category } = req.body;
  const image = req.file?.filename;

  if (!name) {
    deleteFile(image);
    return apiResponse(res, 400, "course name is required");
  }
  if (!image) return apiResponse(res, 400, "course image is required");
  const slug = createSlug(name);

  const existsCourse = await courseModel.findOne({ slug });
  if (existsCourse) {
    deleteFile(image);
    return apiResponse(res, 409, "course already exists");
  }
  const findCategory = await categoryModel.findById(category);
  if (!findCategory) {
    deleteFile(image);
    return apiResponse(res, 400, "category not found");
  }

  const course = new courseModel({
    name,
    image: `${process.env.UPLOADS_BASE_URL}/${image}`,
    price,
    duration,
    slug,
    students,
    isActive,
    category,
  });

  findCategory.courses.push(course._id);
  await findCategory.save();

  await course.save();
  apiResponse(res, 200, "course added successfully", course);
});

exports.findAllCourseController = asyncHandler(async (req, res) => {
  const course = await courseModel
    .find({})
    .select("name image price duration slug isActive")
    .populate("category", "name -_id")
    .sort({ createdAt: -1 });
  apiResponse(res, 200, "course fetched successfully", course);
});

exports.deleteCourseController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await courseModel.findById(id);
  if (!course) return apiResponse(res, 404, "course not found");
  deleteFile(course.image);
  await course.deleteOne();

  const findCategory = await categoryModel.findById(course.category);
  findCategory.courses.pull(course._id);
  await findCategory.save();

  apiResponse(res, 200, "course deleted successfully", course);
});

exports.updateCourseController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, duration, isActive, students, category } = req.body;
  const image = req.file?.filename;
  const course = await courseModel.findById(id);
  if (!course) return apiResponse(res, 404, "course not found");
  if (image) {
    // delete old file from uploads folder and update new file in uploads folder
    course.image = await fileUpdateHelper(course.image, image);
  }
  if (name) {
    const slug = createSlug(name);
    course.slug = slug;
    course.name = name;
  }
  if (price) course.price = price;
  if (duration) course.duration = duration;
  if (isActive !== undefined) course.isActive = isActive;
  if (students) course.students = students;
  if (category) {
    const findCategory = await categoryModel.findById(category);
    if (!findCategory) return apiResponse(res, 400, "category not found");
    const oldCategory = await categoryModel.findById(course.category);
    if (oldCategory) {
      oldCategory.courses.pull(course._id);
      await oldCategory.save();
    }
    findCategory.courses.push(course._id);
    await findCategory.save();
    course.category = category;
  }

  await course.save();
  apiResponse(res, 200, "course updated successfully", course);
});
