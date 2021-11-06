import React, { useState } from "react"
import { Form, Button, Col } from "react-bootstrap"
import FormContainer from "../components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import { savePaymentMethod } from "../actions/cartActions"
import CheckoutSteps from "../components/CheckoutSteps"
import Meta from "../components/Meta"

const PaymentScreen = ({ history }) => {
	const cart = useSelector((state) => state.cart)
	const { shippingAddress } = cart
	if (!shippingAddress) {
		history.push("/shipping")
	}

	const [paymentMethod, setPaymentMethod] = useState("PayPal")

	const dispatch = useDispatch()
	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(savePaymentMethod(paymentMethod))
		history.push("/placeorder")
	}

	return (
		<FormContainer>
			<Meta title="Payment" />
			<CheckoutSteps step1 step2 step3 />
			<h1>Payment Method</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group controlId="">
					<Form.Label as="legend">Select Method</Form.Label>
					<Col>
						<Form.Check type="radio" label="PayPal or Credit Card" id="PayPal" name="paymentMehtod" value="PayPal" checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
						<Form.Check type="radio" label="Stripe" id="Stripe" name="paymentMehtod" value="Stripe" onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
					</Col>
				</Form.Group>

				<Button type="submit" variant="primary" className="mt-3">
					Continue
				</Button>
			</Form>
		</FormContainer>
	)
}

export default PaymentScreen
