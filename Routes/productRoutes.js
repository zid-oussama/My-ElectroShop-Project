const express = require("express")
const { getProducts, getProductById, deleteProduct, updateProduct, createProduct, createProductReview } = require("../Controllers/productControler")
const router = express.Router()
const { protect, admin } = require("../Middleware/authMiddleware")

router.route("/").get(getProducts).post(protect, admin, createProduct)
router.route("/:id/reviews").post(protect, createProductReview)

router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)

module.exports = router
