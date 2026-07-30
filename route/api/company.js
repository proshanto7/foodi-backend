const express = require("express");
const { authorize } = require("../../middleware/authorize");
const { authorizeRole } = require("../../middleware/authorizeRole");
const {
  addCompanyController,
  allCompanyController,
  deleteCompanyController,
  updateCompanyController,
} = require("../../controller/company.controller");
const uploadFile = require("../../helpers/uploadsFile");
const router = express.Router();

const upload = uploadFile(["jpg", "jpeg", "png", "webp"], 2);

router.post(
  "/add-company",
  authorize,
  authorizeRole("admin"),
  upload.single("company-image"),
  addCompanyController,
);

router.get("/all-company", allCompanyController);
router.delete(
  "/delete-company/:id",
  authorize,
  authorizeRole("admin"),
  deleteCompanyController,
);
router.patch(
  "/update-company/:id",
  authorize,
  authorizeRole("admin"),
  upload.single("company-image"),
  updateCompanyController,
);

module.exports = router;
