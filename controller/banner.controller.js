const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { deleteFile } = require("../helpers/deleteHelper");
const { handleFileUpdate } = require("../helpers/fileUpdateHelper");
const bannerModel = require("../model/banner.model");
exports.addBannerController = asyncHandler(async (req, res) => {
  const image = req.file.filename;
  const { title, subtitle, isActive } = req.body;
  if (!title) {
    deleteFile(image);
  }

  const banner = new bannerModel({
    title,
    subtitle,
    image: `${process.env.UPLOADS_BASE_URL}/${image}`,
    isActive,
  });
  await banner.save();
  apiResponse(res, 200, "banner added successfully");
});

exports.findAllBannerController = asyncHandler(async (req, res) => {
  const banner = await bannerModel
    .find({})
    .select("image title subtitle isActive")
    .sort({ createdAt: -1 });
  apiResponse(res, 200, "banner fetched successfully", banner);
});

exports.deleteBannerController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const findBanner = await bannerModel.findById(id);
  if (!findBanner) return apiResponse(res, 404, "banner not found");
  // delete file from uploads folder
  await deleteFile(findBanner.image); // call deleteFile function
  // delete banner from database
  await findBanner.deleteOne();
  apiResponse(res, 200, "banner deleted successfully");
});

exports.updateBannerController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = req.file.filename;
  const { isActive, title, subtitle } = req.body;
  const banner = await bannerModel.findById(id);
  if (!banner) {
    // delete file from uploads folder
    if (image) {
      await deleteFile(image); // call deleteFile function
    }
    return apiResponse(res, 404, "banner not found");
  }
  // update banner in database , delete old file from uploads folder and update new file in uploads folder
  banner.image = await handleFileUpdate(banner.image, image); // call handleFileUpdate function
  if (isActive || title || subtitle) {
    banner.isActive = isActive;
    banner.title = title;
    banner.subtitle = subtitle;
  }

  await banner.save();
  apiResponse(res, 200, "banner updated successfully");
});
