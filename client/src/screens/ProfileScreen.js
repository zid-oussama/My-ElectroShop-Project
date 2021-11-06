import React, { useEffect, useState } from "react"
import { Form, Button, Row, Col, Table } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Message"
import { getUserDetails, updateUserProfile } from "../actions/userActions"
import { useDispatch, useSelector } from "react-redux"
import { listMyOrders } from "../actions/orderActions"
import { LinkContainer } from "react-router-bootstrap"

const ProfileScreen = ({ location, history }) => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [name, setName] = useState("")
	const [confirmPassword, setconfirmPassword] = useState("")
	const [message, setMessage] = useState(null)
	const dispatch = useDispatch()

	const userDetails = useSelector((state) => state.userDetails)
	const { loading, error, user } = userDetails
	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin
	const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
	const { success } = userUpdateProfile

	const orderMyList = useSelector((state) => state.orderMyList)
	const { loading: loadingOrders, error: errorOrders, orders } = orderMyList

	useEffect(() => {
		if (!userInfo) {
			history.push("/login")
		} else {
			if (!user.name) {
				dispatch(getUserDetails("profile"))
				dispatch(listMyOrders())
			} else {
				setName(user.name)
				setEmail(user.email)
			}
		}
	}, [dispatch, history, userInfo, user])

	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setMessage("Password do not match")
		} else {
			setMessage(null)
			dispatch(updateUserProfile({ name, email, password }))
		}
	}
	setTimeout(() => {
		if (message) {
			setMessage(null)
		}
	}, 4000)

	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{message && <Message variant="danger">{message}</Message>}
				{success && <Message variant="success">Profile Updated</Message>}
				{error && <Message variant="danger">{error}</Message>}
				{loading && <Loader />}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId="name">
						<Form.Label className="my-2">Name Address</Form.Label>
						<Form.Control type="name" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
					</Form.Group>
					<Form.Group controlId="email">
						<Form.Label className="my-2">Email Address</Form.Label>
						<Form.Control type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
					</Form.Group>
					<Form.Group controlId="password">
						<Form.Label className="my-2">Password</Form.Label>
						<Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
					</Form.Group>
					<Form.Group controlId="confirmpassword">
						<Form.Label className="my-2">Confirm Password</Form.Label>
						<Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)}></Form.Control>
					</Form.Group>
					<Button className="my-2" type="submit" variant="primary">
						Update
					</Button>
				</Form>
			</Col>
			<Col md={9}>
				<h2>My Orders</h2>
				{loadingOrders ? (
					<Loader />
				) : errorOrders ? (
					<Message variant="danger">{errorOrders}</Message>
				) : (
					<Table striped bordered hover responsive className="table-sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						{orders && (
							<tbody>
								{orders.map((order) => (
									<tr key={order._id}>
										<td>{order._id}</td>
										<td>{order.createdAt}</td>
										<td>{order.totalPrice}</td>
										<td>{order.isPaid ? order.paymentResult.update_time.substring(0, 10) : <i className="fas fa-times" style={{ color: "red" }}></i>}</td>
										<td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <i className="fas fa-times" style={{ color: "red" }}></i>} </td>
										<td>
											<LinkContainer to={`/order/${order._id}`}>
												<Button className="btn-sm" variant="light">
													Details{" "}
												</Button>
											</LinkContainer>
										</td>
									</tr>
								))}
							</tbody>
						)}
					</Table>
				)}
			</Col>
		</Row>
	)
}

export default ProfileScreen
