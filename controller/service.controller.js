const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { deleteFile } = require("../helpers/deleteHelper");
const { handleFileUpdate } = require("../helpers/fileUpdateHelper");
const serviceModel = require("../model/service.model");

exports.addServiceController = asyncHandler(async (req, res) => {
  const icon = req.file?.filename;
  const { title, description, sortOrder, isActive } = req.body;

  if (!title || !description || !icon) {
    if (icon) deleteFile(icon);
    return apiResponse(res, 400, "title, description and icon are required");
  }

  const service = new serviceModel({
    title,
    description,
    icon: `${process.env.UPLOADS_BASE_URL}/${icon}`,
    sortOrder,
    isActive,
  });

  await service.save();
  apiResponse(res, 201, "service added successfully");
});

exports.findAllServiceController = asyncHandler(async (req, res) => {
  const services = await serviceModel
    .find({ isActive: true })
    .select("title description icon sortOrder")
    .sort({ sortOrder: 1, createdAt: -1 });

  apiResponse(res, 200, "services fetched successfully", services);
});

exports.findSingleServiceController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await serviceModel.findById(id);
  if (!service) return apiResponse(res, 404, "service not found");
  apiResponse(res, 200, "service fetched successfully", service);
});

exports.deleteServiceController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const findService = await serviceModel.findById(id);
  if (!findService) return apiResponse(res, 404, "service not found");

  await deleteFile(findService.icon);
  await findService.deleteOne();

  apiResponse(res, 200, "service deleted successfully");
});

exports.updateServiceController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const icon = req.file?.filename;
  const { title, description, sortOrder, isActive } = req.body;

  const service = await serviceModel.findById(id);
  if (!service) {
    if (icon) await deleteFile(icon);
    return apiResponse(res, 404, "service not found");
  }

  if (icon) {
    service.icon = await handleFileUpdate(service.icon, icon);
  }

  if (title) service.title = title.trim();
  if (description) service.description = description.trim();
  if (sortOrder !== undefined) service.sortOrder = sortOrder;
  if (isActive !== undefined) service.isActive = isActive;

  await service.save();
  apiResponse(res, 200, "service updated successfully");
});