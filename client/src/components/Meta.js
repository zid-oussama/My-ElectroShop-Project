import { Helmet } from "react-helmet"
import React from "react"

const Meta = ({ title, description, keywords }) => {
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta name="keywords" content={keywords} />
			</Helmet>
		</>
	)
}

Meta.defaultProps = {
	title: "Welcome To EleCTroShOp",
	description: "We sell the best electro",
	keywords: "electronics, buy electronics, cheap electronics",
}

export default Meta
