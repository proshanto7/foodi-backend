const express = require("express");
const router = express.Router();
router.use("/banner", require("./banner"));
module.exports = router;
