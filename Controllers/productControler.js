const Product = require("../Models/productModel")
const asyncHandler = require("express-async-handler")

//@desc    Fetch all products
//@route   Get /api/products
//@access  Public
exports.getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10
	const page = Number(req.query.pageNumber) || 1
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: "i",
				},
		  }
		: {}
	const count = await Product.count({ ...keyword })
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1))

	res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

//@desc    Fetch single product
//@route   Get /api/products/:id
//@access  Public
exports.getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)
	if (product) {
		res.json(product)
	} else {
		res.status(404)
		throw new Error("Product not found")
	}
})

//@desc    Delete product
//@route   DELETE /api/products/:id
//@access  Public/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)
	if (product) {
		await product.remove()
		res.json({ msg: "product removed" })
	} else {
		res.status(404)
		throw new Error("Product not found")
	}
})

//@desc    Create product
//@route   POST /api/products/
//@access  Public/Admin
exports.createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		user: req.user.id,
		name: "sample name",
		price: 0,
		image: "/images/sample.jpg",
		brand: "Sample Brand",
		category: "Sample Category",
		countInStock: 0,
		numReviews: 0,
		description: "Sample description",
	})
	const createdProduct = await product.save()
	res.status(201).json(createdProduct)
})

//@desc    Update product
//@route   PUT /api/products/:id
//@access  Public/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock, rating } = req.body
	const product = await Product.findById(req.params.id)
	if (product) {
		product.name = name
		product.price = price
		product.description = description
		product.image = image
		product.brand = brand
		product.category = category
		product.rating = rating
		product.countInStock = countInStock
		const updatedProduct = await product.save()
		res.json(updatedProduct)
	} else {
		res.status(404)
		throw new Error("Product not found")
	}
})

//@desc    Create New  Review
//@route   POST /api/products/:id/reviews
//@access  Public
exports.createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body
	const product = await Product.findById(req.params.id)
	if (product) {
		const alreadyReviewed = await product.reviews.find((r) => r.user.toString() === req.user._id.toString())
		if (alreadyReviewed) {
			res.status(400)
			throw new Error("product already reviewed")
		}
		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		}
		product.reviews.unshift(review)
		product.numReviews = product.reviews.length
		product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
		await product.save()
		res.status(201).json({ message: "Review added" })
	} else {
		res.status(404)
		throw new Error("Product not found")
	}
})
