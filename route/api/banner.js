const express = require("express");
const {
  addBannerController,
  findAllBannerController,
  deleteBannerController,
  updateBannerController,
} = require("../../controller/banner.controller");
const { authorize } = require("../../middleware/authorize");
const { authorizeRole } = require("../../middleware/authorizeRole");
const uploadFile = require("../../helpers/uploadsFile");
const router = express.Router();

const upload = uploadFile(["jpg", "jpeg", "png", "webp"], 2); // 2MB limit, allowed extensions jpg/jpeg/png/webp

router.post(
  "/add-banner",
  authorize,
  authorizeRole("admin", "editor"),
  upload.single("banner-image"),
  addBannerController,
);

router.get("/all-banner", findAllBannerController);

router.delete(
  "/delete-banner/:id",
  authorize,
  authorizeRole("admin", "editor"),
  deleteBannerController,
);

router.patch(
  "/update-banner/:id",
  authorize,
  authorizeRole("admin", "editor"),
  upload.single("banner-image"),
  updateBannerController,
);

module.exports = router;
