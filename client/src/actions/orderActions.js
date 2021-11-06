import {
	ORDERS_LIST_FAIL,
	ORDERS_LIST_REQUEST,
	ORDERS_LIST_SUCCESS,
	ORDER_CREATE_FAIL,
	ORDER_CREATE_REQUEST,
	ORDER_CREATE_SUCCESS,
	ORDER_DELIVER_FAIL,
	ORDER_DELIVER_REQUEST,
	ORDER_DELIVER_SUCCESS,
	ORDER_DETAILS_FAIL,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_SUCCESS,
	ORDER_LIST_FAIL,
	ORDER_LIST_REQUEST,
	ORDER_LIST_SUCCESS,
	ORDER_PAY_FAIL,
	ORDER_PAY_REQUEST,
	ORDER_PAY_SUCCESS,
} from "../constants/orderConstants"
import axios from "axios"

export const createOrder = (order) => async (dispatch, getState) => {
	dispatch({ type: ORDER_CREATE_REQUEST })
	try {
		const {
			userLogin: { userInfo },
		} = getState()
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		}
		const { data } = await axios.post(`/api/orders/`, order, config)
		dispatch({ type: ORDER_CREATE_SUCCESS, payload: data })
	} catch (error) {
		dispatch({ type: ORDER_CREATE_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
	}
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
	dispatch({ type: ORDER_DETAILS_REQUEST })
	try {
		const {
			userLogin: { userInfo },
		} = getState()
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}
		const { data } = await axios.get(`/api/orders/${id}`, config)

		dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data })
	} catch (error) {
		dispatch({ type: ORDER_DETAILS_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
	}
}

export const payOrder = (id, paymentResulat) => async (dispatch, getState) => {
	dispatch({ type: ORDER_PAY_REQUEST })
	try {
		const {
			userLogin: { userInfo },
		} = getState()
		const config = {
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		}
		const { data } = await axios.put(`/api/orders/${id}/pay`, paymentResulat, config)

		dispatch({ type: ORDER_PAY_SUCCESS, payload: data })
	} catch (error) {
		dispatch({ type: ORDER_PAY_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
	}
}

export const deliverOrder = (id) => async (dispatch, getState) => {
	dispatch({ type: ORDER_DELIVER_REQUEST })
	try {
		const {
			userLogin: { userInfo },
		} = getState()
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}
		const { data } = await axios.put(`/api/orders/${id}/deliver`, {}, config)

		dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data })
	} catch (error) {
		dispatch({ type: ORDER_DELIVER_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
	}
}

export const listMyOrders = () => async (dispatch, getState) => {
	dispatch({ type: ORDER_LIST_REQUEST })
	try {
		const {
			userLogin: { userInfo },
		} = getState()
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}
		const { data } = await axios.get("/api/orders/myorders", config)
		dispatch({ type: ORDER_LIST_SUCCESS, payload: data })
	} catch (error) {
		dispatch({ type: ORDER_LIST_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
	}
}

export const listOrders = () => async (dispatch, getState) => {
	dispatch({ type: ORDERS_LIST_REQUEST })
	try {
		const {
			userLogin: { userInfo },
		} = getState()
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}
		const { data } = await axios.get("/api/orders", config)

		dispatch({ type: ORDERS_LIST_SUCCESS, payload: data })
	} catch (error) {
		dispatch({ type: ORDERS_LIST_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
	}
}
