const express = require("express");
const {
  addServiceController,
  findAllServiceController,
  findSingleServiceController,
  deleteServiceController,
  updateServiceController,
} = require("../../controller/service.controller");
const uploadFile = require("../../helpers/uploadsFile");

const router = express.Router();
const upload = uploadFile(["jpg", "jpeg", "png", "webp", "svg"], 1); // 1MB limit, icons are small

router.post("/", upload.single("service-icon"), addServiceController);
router.get("/", findAllServiceController);
router.get("/:id", findSingleServiceController);
router.delete("/:id", deleteServiceController);
router.patch("/:id", upload.single("service-icon"), updateServiceController);

module.exports = router;