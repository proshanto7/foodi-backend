const express = require("express");
const {
  addBannerController,
  findAllBannerController,
  findSingleBannerController,
  deleteBannerController,
  updateBannerController,
} = require("../../controller/banner.controller");
const uploadFile = require("../../helpers/uploadsFile");
const router = express.Router();

const upload = uploadFile(["jpg", "jpeg", "png", "webp"], 2); // 2MB limit, allowed extensions jpg/jpeg/png/webp

router.post("/", upload.single("banner-image"), addBannerController);

router.get("/", findAllBannerController);

router.get("/:id", findSingleBannerController);

router.delete("/:id", deleteBannerController);

router.patch(
  "/:id",
  upload.single("banner-image"),
  updateBannerController
);

module.exports = router;