const express = require("express");
const {
  addCategoryController,
  findAllCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require("../../controller/category.controller");
const { authorize } = require("../../middleware/authorize");
const { authorizeRole } = require("../../middleware/authorizeRole");
const uploadFile = require("../../helpers/uploadsFile");
const router = express.Router();

const upload = uploadFile(["jpg", "jpeg", "png", "webp"], 2);

router.post(
  "/add-category",
  authorize,
  authorizeRole("admin"),
  upload.single("category-image"),
  addCategoryController,
);
router.get("/all-category", findAllCategoryController);

router.patch(
  "/update-category/:id",
  authorize,
  authorizeRole("admin"),
  upload.single("category-image"),
  updateCategoryController,
);

router.delete(
  "/delete-category/:id",
  authorize,
  authorizeRole("admin"),
  deleteCategoryController,
);

module.exports = router;
