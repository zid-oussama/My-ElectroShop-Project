import React, { useState, useEffect } from "react"
import { Button, Card, Col, Form, FormControl, FormGroup, FormLabel, Image, ListGroup, ListGroupItem, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import Rating from "../components/Rating"
import { useDispatch, useSelector } from "react-redux"
import { listProductDetails, createProductReview } from "../actions/productActions"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants"
import Meta from "../components/Meta"

const ProductScreen = ({ history, match }) => {
	const [qty, setQty] = useState(1)
	const [rating, setRating] = useState(0)
	const [comment, setComment] = useState("")

	const { loading, error, product } = useSelector((state) => state.productDetails)
	const { error: errorProductReview, success: successProductReview } = useSelector((state) => state.productReviewCreate)
	const { userInfo } = useSelector((state) => state.userLogin)

	const dispatch = useDispatch()
	useEffect(() => {
		if (successProductReview) {
			alert("Review Submiting!")
			setRating(0)
			setComment("")
			dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
		}
		dispatch(listProductDetails(match.params.id))
	}, [dispatch, match, successProductReview])

	const addToCartHandler = () => {
		history.push(`/cart/${match.params.id}?qty=${qty}`)
	}

	console.log(match.params.id)
	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(createProductReview(match.params.id, { rating, comment }))
	}

	return (
		<>
			<Link className="btn btn-light my-3 px-2 py-1 rounded" to="/">
				Go Back
			</Link>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Meta title={product.name} />
					<Row>
						<Col md={6}>
							<Image src={product.image} alt={product.name} fluid />
						</Col>
						<Col md={3}>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h3>{product.name}</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<Rating value={product.rating} text={`${product.numReviews} reviews`} />
								</ListGroup.Item>
								<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
								<ListGroup.Item>Description: ${product.description}</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<ListGroup>
									<ListGroup.Item>
										<Row>
											<Col>Price:</Col>
											<Col>
												<strong>${product.price}</strong>
											</Col>
										</Row>
									</ListGroup.Item>

									<ListGroup.Item>
										<Row>
											<Col>Status:</Col>
											<Col>{product.countInStock > 0 ? "In Stock" : "Out Of Stock"}</Col>
										</Row>
									</ListGroup.Item>
									{product.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col>quantity</Col>
												<Col>
													<Form.Control as="select" value={qty} onChange={(e) => setQty(e.target.value)}>
														{[...Array(product.countInStock).keys()].map((el) => (
															<option key={el + 1} value={el + 1}>
																{el + 1}
															</option>
														))}
													</Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
									)}
									<ListGroup.Item className="d-grid ">
										<Button onClick={addToCartHandler} className="btn-block" type="button" disabled={product.countInStock === 0}>
											Add To Cart
										</Button>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col md={6} className="mt-4">
							<h2>Reviews</h2>
							{product.reviews.length === 0 && <Message> No Reviews</Message>}
							<ListGroup variant="flush">
								{product.reviews.map((review) => (
									<ListGroupItem key={review._id}>
										<strong>{review.name}</strong>
										<Rating value={review.rating} />
										<p>{review.createdAt}</p>
										<p>{review.comment}</p>
									</ListGroupItem>
								))}
							</ListGroup>
						</Col>
						<Col className="mt-4">
							<h2>Write a Customer Review</h2>
							<ListGroup variant="flush">
								<ListGroupItem>
									{errorProductReview && <Message variant="danger">{errorProductReview} </Message>}
									{userInfo ? (
										<Form onSubmit={submitHandler}>
											<FormGroup controlId="rating">
												<FormLabel>Rating</FormLabel>
												<FormControl as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
													<option value="">Select</option>
													<option value="1">1 - Poor</option>
													<option value="2">2 - Fair</option>
													<option value="3">3 - Good</option>
													<option value="4">4 - Very Good</option>
													<option value="5">5 - Excellent</option>
												</FormControl>
											</FormGroup>
											<FormGroup controlId="comment">
												<FormLabel>Comment</FormLabel>
												<FormControl as="textarea" row="3" value={comment} onChange={(e) => setComment(e.target.value)}>
													{" "}
												</FormControl>
											</FormGroup>
											<Button type="submit" variant="primary" className="mt-2">
												Submit
											</Button>
										</Form>
									) : (
										<Message>
											Please <Link to="/login">Sign in </Link>To Write Review
										</Message>
									)}
								</ListGroupItem>
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	)
}

export default ProductScreen
