import React, { useEffect, useState } from "react"
import axios from "axios"
import { Row, Col, ListGroup, Image, Card, ListGroupItem, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { Link } from "react-router-dom"
import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions"
import { PayPalButton } from "react-paypal-button-v2"
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants"

const OrderScreen = ({ history, match }) => {
	const orderId = match.params.id
	const [sdkReady, setsdkReady] = useState(false)

	const orderDetails = useSelector((state) => state.orderDetails)
	const { order, loading, error } = orderDetails
	const orderPay = useSelector((state) => state.orderPay)
	const { loading: loadingPay, success: successPay } = orderPay
	const orderDeliver = useSelector((state) => state.orderDeliver)
	const { loading: loadingDeliver, success: successDeliver } = orderDeliver
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	const dispatch = useDispatch()
	useEffect(() => {
		if (!userInfo) {
			history.push("/login")
		}
		const addPaypalScript = async () => {
			const { data: clientId } = await axios.get("/api/config/paypal")
			const script = document.createElement("script")
			script.type = "text/javascript"
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
			script.async = true
			script.onload = () => setsdkReady(true)
			document.body.appendChild(script)
		}
		if (!order || successPay || successDeliver) {
			dispatch({ type: ORDER_PAY_RESET })
			dispatch({ type: ORDER_DELIVER_RESET })
			dispatch(getOrderDetails(orderId))
		} else {
			if (!order.isPaid) {
				if (!window.paypal) {
					addPaypalScript()
				} else {
					setsdkReady(true)
				}
			}
		}
	}, [dispatch, history, userInfo, orderId, successPay, order, successDeliver])

	const successPaymentHandler = (paymentResult) => {
		console.log(paymentResult)
		dispatch(payOrder(orderId, paymentResult))
	}
	const deliverHandler = () => {
		dispatch(deliverOrder(order._id))
	}

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant="danger">{error}</Message>
	) : (
		<>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroupItem>
							<h2>Shipping</h2>
							<p>
								<strong style={{ color: "blue" }}>Name : </strong> {order.user.name}
							</p>
							<p>
								<strong style={{ color: "blue" }}>Email : </strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<span style={{ color: "blue" }}>Address : </span>
								{order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{order.shippingAddress.country}
							</p>
							{order.isDelivered ? <Message variant="success">Delivred on {order.deliveredAt}</Message> : <Message variant="danger">Not Delivered</Message>}
						</ListGroupItem>

						<ListGroupItem>
							<h2>Payment Method</h2>

							<p>
								<strong style={{ color: "blue" }}>Mehtod : </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? <Message variant="success">Paid on {order.paymentResult.update_time}</Message> : <Message variant="danger">Not Paid</Message>}
						</ListGroupItem>

						<ListGroupItem>
							<h2>Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Order is empty </Message>
							) : (
								<ListGroup variant="flush">
									{order.orderItems.map((item, index) => (
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
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Shipping</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Tax</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroupItem>
							{!order.isPaid && (
								<ListGroupItem>
									{loadingPay && <Loader />}
									{!sdkReady ? <Loader /> : <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}></PayPalButton>}
								</ListGroupItem>
							)}
							{userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroupItem>
									{loadingDeliver && <Loader />}
									<Button type="button" className="btn w-100" onClick={deliverHandler}>
										Mark As Delivered
									</Button>
								</ListGroupItem>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderScreen
