const express = require("express");
const router = express.Router();
router.use("/banner", require("./banner"));
router.use("/category", require("./category"));
router.use("/dish", require("./dish"));
router.use("/service", require("./service"));
module.exports = router;
