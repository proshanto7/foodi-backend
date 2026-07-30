const express = require("express");
const {
  addCategoryController,
  findAllCategoryController,
  findSingleCategoryController,
  deleteCategoryController,
  updateCategoryController,
} = require("../../controller/category.controller");
const uploadFile = require("../../helpers/uploadsFile");
const router = express.Router();

const upload = uploadFile(["jpg", "jpeg", "png", "webp"], 2); // 2MB limit, allowed extensions jpg/jpeg/png/webp

router.post("/", upload.single("category-image"), addCategoryController);

router.get("/", findAllCategoryController);

router.get("/:id", findSingleCategoryController);

router.delete("/:id", deleteCategoryController);

router.patch("/:id", upload.single("category-image"), updateCategoryController);

module.exports = router;