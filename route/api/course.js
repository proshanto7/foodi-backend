const express = require("express");
const { authorize } = require("../../middleware/authorize");
const { authorizeRole } = require("../../middleware/authorizeRole");
const uploadFile = require("../../helpers/uploadsFile");
const {
  addCourseController,
  findAllCourseController,
  deleteCourseController,
  updateCourseController,
} = require("../../controller/course.controller");
const router = express.Router();
const upload = uploadFile(["jpg", "jpeg", "png", "webp"], 2);

router.post(
  "/add-course",
  authorize,
  authorizeRole("admin"),
  upload.single("course-image"),
  addCourseController,
);
router.get("/all-courses", findAllCourseController);

router.delete(
  "/delete-course/:id",
  authorize,
  authorizeRole("admin"),
  deleteCourseController,
);
router.patch(
  "/update-course/:id",
  authorize,
  authorizeRole("admin"),
  upload.single("course-image"),
  updateCourseController
);

module.exports = router;
