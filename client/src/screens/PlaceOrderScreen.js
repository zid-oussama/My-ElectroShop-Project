import React, { useEffect } from "react"
import { Row, Button, Col, ListGroup, Image, Card, ListGroupItem } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import CheckoutSteps from "../components/CheckoutSteps"
import { Link } from "react-router-dom"
import { createOrder } from "../actions/orderActions"

const PlaceOrderScreen = ({ history }) => {
	const cart = useSelector((state) => state.cart)
	cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
	cart.shippingPrice = cart.cartItems > 100 ? 0 : 100
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2)
	}
	cart.taxPrice = addDecimals(Number(0.15 * cart.itemsPrice))
	cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

	const orderCreate = useSelector((state) => state.orderCreate)
	const { order, success, error } = orderCreate

	useEffect(() => {
		if (success) {
			history.push(`/order/${order._id}`)
		}
		// eslint-disable-next-line
	}, [history, success, cart.paymentMehtod])

	const dispatch = useDispatch()
	const placeOrderHandler = () => {
		dispatch(
			createOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				shippingPrice: cart.shippingPrice,
				taxPrice: cart.taxPrice,
				totalPrice: cart.totalPrice,
				itemsPrice: cart.itemsPrice,
				paymentMethod: cart.paymentMethod,
			})
		)
	}

	return (
		<div>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroupItem>
							<h2>Shipping</h2>
							<p>
								<span style={{ color: "blue" }}>Address : </span>
								{cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.postalCode},{cart.shippingAddress.country}
							</p>
						</ListGroupItem>

						<ListGroupItem>
							<h2>Payment Method</h2>
							<p>
								<span style={{ color: "blue" }}>Mehtod : </span>
								{cart.paymentMethod}
							</p>
						</ListGroupItem>

						<ListGroupItem>
							<h2>Order Items</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your cart is empty </Message>
							) : (
								<ListGroup variant="flush">
									{cart.cartItems.map((item, index) => (
										<ListGroupItem key={index}>
											<Row>
												<Col md={1}>
													<Image src={item.image} alt={item.name} fluid rounded></Image>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>{item.name}</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
											</Row>
										</ListGroupItem>
									))}
								</ListGroup>
							)}
						</ListGroupItem>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroupItem>
								<h2>Order Summary</h2>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Items</Col>
									<Col>${cart.itemsPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Shipping</Col>
									<Col>${cart.shippingPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Tax</Col>
									<Col>${cart.taxPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Total</Col>
									<Col>${cart.totalPrice}</Col>
								</Row>
							</ListGroupItem>
							{error && (
								<ListGroupItem>
									{" "}
									<Message variant="danger">{error}</Message>{" "}
								</ListGroupItem>
							)}
							<ListGroupItem>
								<Button type="button" className="w-100" disabled={cart.cartItems === 0} onClick={placeOrderHandler}>
									Place Order
								</Button>
							</ListGroupItem>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</div>
	)
}

export default PlaceOrderScreen
