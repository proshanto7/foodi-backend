const { deleteFile } = require("../helpers/deleteHelper");
const { fileUpdateHelper } = require("../helpers/fileUpdateHelper");
const companyModel = require("../model/company.model");
const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

exports.addCompanyController = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;
  const image = req.file.filename;

  const company = new companyModel({
    name,
    image: `${process.env.UPLOADS_BASE_URL}/${image}`,
    isActive,
  });

  await company.save();
  apiResponse(res, 200, "company added successfully", company);
});

exports.allCompanyController = asyncHandler(async (req, res) => {
  const company = await companyModel
    .find({})
    .select("name image isActive")
    .sort({ createdAt: -1 });
  apiResponse(res, 200, "company fetched successfully", company);
});

exports.deleteCompanyController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const company = await companyModel.findById(id);
  if (!company) {
    return apiResponse(res, 404, "company not found");
  }
  await deleteFile(company.image);
  await company.deleteOne();
  apiResponse(res, 200, "company deleted successfully", company);
});

exports.updateCompanyController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;
  const image = req.file?.filename;
  const company = await companyModel.findById(id);
  if (!company) {
    return apiResponse(res, 404, "company not found");
  }
  if (image) {
    // delete old file from uploads folder and update new file in uploads folder 
    company.image = await fileUpdateHelper(company.image, image);
  }
  company.name = name;
  company.isActive = isActive;
  await company.save();
  apiResponse(res, 200, "company updated successfully", company);
});
