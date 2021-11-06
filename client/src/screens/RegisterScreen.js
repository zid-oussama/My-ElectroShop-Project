import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import Message from "../components/Message"
import Loader from "../components/Message"
import { register } from "../actions/userActions"
import FormContainer from "../components/FormContainer"
import { useDispatch, useSelector } from "react-redux"

const RegisterScreen = ({ location, history }) => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [name, setName] = useState("")
	const [confirmPassword, setconfirmPassword] = useState("")
	const [message, setMessage] = useState(null)
	const dispatch = useDispatch()
	const userLogin = useSelector((state) => state.userRegister)
	const { loading, error, userInfo } = userLogin

	const redirect = location.search ? location.search.split("=")[1] : "/"

	useEffect(() => {
		if (userInfo) {
			history.push(redirect)
		}
	}, [history, userInfo, redirect])
	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setMessage("Password do not match")
		} else {
			setMessage(null)
			dispatch(register(name, email, password))
		}
	}
	setTimeout(() => {
		if (message) {
			setMessage(null)
		}
	}, 4000)

	return (
		<FormContainer>
			<h1>Sign Up</h1>
			{message && <Message variant="danger">{message}</Message>}

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
					Sign Up
				</Button>
			</Form>
			<Row className="py-3">
				<Col>
					Have already an Account?<Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
				</Col>
			</Row>
		</FormContainer>
	)
}

export default RegisterScreen
