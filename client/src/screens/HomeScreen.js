import React, { useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import Product from "../components/Product"
import { useDispatch, useSelector } from "react-redux"
import { listProducts } from "../actions/productActions"
import Loader from "../components/Loader"
import Paginate from "../components/Paginate"
import Message from "../components/Message"
import Meta from "../components/Meta"

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword
	const pageNumber = match.params.pageNumber || 1

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber))
	}, [dispatch, keyword, pageNumber])
	const { products, page, pages, error, loading } = useSelector((state) => state.productList)

	return (
		<>
			<Meta />
			<h1 className="mt-4">Latest Profucts</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Row>
						{products.map((product, i) => (
							<Col sm={12} md={6} lg={4} xl={3} key={i}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate page={page} pages={pages} keyword={keyword ? keyword : ""} />
				</>
			)}
		</>
	)
}

export default HomeScreen
