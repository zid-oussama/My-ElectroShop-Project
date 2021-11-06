const express = require("express")
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered } = require("../Controllers/orderController")
const { protect, admin } = require("../Middleware/authMiddleware")
const router = express.Router()

router.route("/").post(protect, addOrderItems)
router.route("/myorders").get(protect, getMyOrders)
router.route("/").get(protect, admin, getOrders)
router.route("/:id").get(protect, getOrderById)
router.route("/:id/pay").put(protect, updateOrderToPaid)
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered)

module.exports = router
