import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Message"
import FormContainer from "../components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import { listProductDetails, updateProduct } from "../actions/productActions"
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants"
import axios from "axios"

const ProductEditScreen = ({ match, history }) => {
	const productId = match.params.id

	const dispatch = useDispatch()

	const [name, setName] = useState("")
	const [price, setPrice] = useState(0)
	const [image, setImage] = useState("")
	const [brand, setBrand] = useState("")
	const [category, setcategory] = useState("")
	const [countInStock, setcountInStock] = useState(0)
	const [description, setdescription] = useState("")
	const [rating, setRating] = useState(0)
	const [uploading, setUploading] = useState(false)

	const productDetails = useSelector((state) => state.productDetails)
	const { loading, error, product } = productDetails
	const productUpdate = useSelector((state) => state.productUpdate)
	const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET })
			history.push("/admin/productlist")
		} else {
			if (!product.name || product._id !== productId) {
				dispatch(listProductDetails(productId))
			} else {
				setName(product.name)
				setPrice(product.price)
				setImage(product.image)
				setBrand(product.brand)
				setcategory(product.category)
				setcountInStock(product.countInStock)
				setdescription(product.description)
				setRating(product.rating)
			}
		}
	}, [dispatch, productId, product, history, successUpdate])
	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(
			updateProduct({
				_id: productId,
				name,
				price,
				image,
				brand,
				category,
				countInStock,
				description,
				rating,
			})
		)
	}
	const uploadFileHandler = async (e) => {
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append("image", file)
		setUploading(true)
		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
			const { data } = await axios.post("/api/upload", formData, config)

			setImage(data)
			setUploading(false)
		} catch (error) {
			console.error(error)
			setUploading(false)
		}
	}
	console.log({ _id: productId, name, price, image, brand, category, countInStock, description, rating })
	return (
		<>
			<Link to="/admin/productlist" className="btn btn-light my-3">
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Product</h1>
				{loadingUpdate && <Loader />}
				{errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId="name">
							<Form.Label className="my-2">Name </Form.Label>
							<Form.Control type="name" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId="Price">
							<Form.Label className="my-2">Price </Form.Label>
							<Form.Control type="number" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId="Image">
							<Form.Label className="my-2">Image</Form.Label>
							<Form.Control type="text" placeholder="Enter Image Url" value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
							<Form.File id="image-file" label="Choose File" custom onChange={uploadFileHandler}></Form.File>
							{uploading && <Loader />}
						</Form.Group>
						<Form.Group controlId="Brand">
							<Form.Label className="my-2">Brand</Form.Label>
							<Form.Control type="text" placeholder="Enter Brand " value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId="Category">
							<Form.Label className="my-2">Category</Form.Label>
							<Form.Control type="text" placeholder="Enter Category " value={category} onChange={(e) => setcategory(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId="CountInStock">
							<Form.Label className="my-2">Count In Stock</Form.Label>
							<Form.Control type="text" placeholder="Enter CountInStock " value={countInStock} onChange={(e) => setcountInStock(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId="Description">
							<Form.Label className="my-2">Description</Form.Label>
							<Form.Control type="text" placeholder="Enter Description " value={description} onChange={(e) => setdescription(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId="Rating">
							<Form.Label className="my-2">Rating</Form.Label>
							<Form.Control type="text" placeholder="Enter Rating " value={rating} onChange={(e) => setRating(e.target.value)}></Form.Control>
						</Form.Group>

						<Button className="my-1" type="submit" variant="primary">
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	)
}

export default ProductEditScreen
