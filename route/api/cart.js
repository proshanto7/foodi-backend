const express = require("express");
const { authorize } = require("../../middleware/authorize");
const {
  addToCartController,
  getCartController,
  deleteCartController,
} = require("../../controller/cart.controller");
const router = express.Router();

router.post("/add-to-cart", authorize, addToCartController);
router.get("/get-cart", authorize, getCartController);
router.delete("/delete-cart/:id", authorize, deleteCartController);

module.exports = router;
