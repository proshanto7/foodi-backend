const express = require("express");
const router = express.Router();
router.use("/banner", require("./banner"));
router.use("/category", require("./category"));
module.exports = router;
