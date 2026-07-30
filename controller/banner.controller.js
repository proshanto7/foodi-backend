const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { deleteFile } = require("../helpers/deleteHelper");
const { handleFileUpdate } = require("../helpers/fileUpdateHelper");
const bannerModel = require("../model/banner.model");

exports.addBannerController = asyncHandler(async (req, res) => {
  const image = req.file?.filename;
  const { title, highlightedWord, description, isActive } = req.body;

  if (!title || !image) {
    if (image) deleteFile(image);
    return apiResponse(res, 400, "title and banner image are required");
  }

  const banner = new bannerModel({
    title,
    highlightedWord,
    description,
    bannerImage: `${process.env.UPLOADS_BASE_URL}/${image}`,
    isActive,
  });

  await banner.save();
  apiResponse(res, 200, "banner added successfully");
});

exports.findAllBannerController = asyncHandler(async (req, res) => {
  const banner = await bannerModel
    .find({})
    .select("bannerImage title highlightedWord description isActive")
    .sort({ createdAt: -1 });
  apiResponse(res, 200, "banner fetched successfully", banner);
});

exports.findSingleBannerController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const banner = await bannerModel.findById(id);
  if (!banner) return apiResponse(res, 404, "banner not found");
  apiResponse(res, 200, "banner fetched successfully", banner);
});

exports.deleteBannerController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const findBanner = await bannerModel.findById(id);
  if (!findBanner) return apiResponse(res, 404, "banner not found");

  // delete file from uploads folder
  await deleteFile(findBanner.bannerImage);
  // delete banner from database
  await findBanner.deleteOne();
  apiResponse(res, 200, "banner deleted successfully");
});

exports.updateBannerController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = req.file?.filename;
  const { title, highlightedWord, description, isActive } = req.body;

  const banner = await bannerModel.findById(id);
  if (!banner) {
    if (image) {
      await deleteFile(image);
    }
    return apiResponse(res, 404, "banner not found");
  }

  // update banner image: delete old file from uploads folder and set new one
  if (image) {
    banner.bannerImage = await handleFileUpdate(banner.bannerImage, image);
  }

  if (title !== undefined) banner.title = title;
  if (highlightedWord !== undefined) banner.highlightedWord = highlightedWord;
  if (description !== undefined) banner.description = description;
  if (isActive !== undefined) banner.isActive = isActive;

  await banner.save();
  apiResponse(res, 200, "banner updated successfully");
});