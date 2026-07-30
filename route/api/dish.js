const express = require("express");
const {
  addDishController,
  findAllDishController,
  findSingleDishController,
  deleteDishController,
  updateDishController,
  toggleFavoriteController,
} = require("../../controller/dish.controller");
const uploadFile = require("../../helpers/uploadsFile");

const router = express.Router();
const upload = uploadFile(["jpg", "jpeg", "png", "webp"], 2); // 2MB limit

router.post("/", upload.single("dish-image"), addDishController);
router.get("/", findAllDishController);
router.get("/:id", findSingleDishController);
router.delete("/:id", deleteDishController);
router.patch("/:id", upload.single("dish-image"), updateDishController);
router.patch("/:id/favorite", toggleFavoriteController);

module.exports = router;