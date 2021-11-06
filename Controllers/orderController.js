const Order = require("../Models/orderModule")
const asyncHandler = require("express-async-handler")

//@desc    Create New Order
//@route   POST /api/orders
//@access  Private
exports.addOrderItems = asyncHandler(async (req, res) => {
	const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

	if (orderItems && orderItems.length === 0) {
		res.status(400)
		throw new Error("No order items")
		return
	} else {
		const order = new Order({
			user: req.user._id,
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		})
		const createOrder = await order.save()
		res.status(201).json(createOrder)
	}
})

//@desc    Get order by id
//@route   GET /api/orders/:id
//@access  Private
exports.getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate("user", "name email")

	if (order) {
		res.json(order)
	} else {
		res.status(404)
		throw new Error("404 not found ")
	}
})

//@desc    update order to paid
//@route   GET /api/orders/:id/pay
//@access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id)

	if (order) {
		order.isPaid = true
		order.paidAt = Date.now()
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address,
		}
		const updatedOrder = await order.save()
		res.json(updatedOrder)
	} else {
		res.status(404)
		throw new Error("404 not found ")
	}
})

//@desc    update order to delivered
//@route   GET /api/orders/:id/deliver
//@access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id)

	if (order) {
		order.isDelivered = true
		order.deliveredAt = Date.now()

		const updatedOrder = await order.save()
		res.json(updatedOrder)
	} else {
		res.status(404)
		throw new Error("404 not found ")
	}
})

//@desc    Get logged in user Orders
//@route   GET /api/orders/myorders
//@access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id })

	res.json(orders)
})

//@desc    Get all  Orders
//@route   GET /api/orders/
//@access  Private/Admin
exports.getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find().populate("user", "id name")

	res.json(orders)
})
