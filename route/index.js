const express = require("express");
const router = express.Router();

router.use(process.env.BASE_URL, require("./api"));

module.exports = router;
