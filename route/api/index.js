const express = require("express");
const router = express.Router();
router.use("/auth", require("./auth"));
router.use("/banner", require("./banner"));
router.use("/company", require("./company"));
router.use("/category", require("./category"));
router.use("/course", require("./course"));
router.use("/cart", require("./cart"));
module.exports = router;
