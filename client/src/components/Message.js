import React from "react"
import { Alert } from "react-bootstrap"

setInterval(() => {}, 6)
const Message = ({ variant, children }) => {
	return <Alert variant={variant}>{children}</Alert>
}
Message.defaultProps = {
	variant: "info",
}
export default Message
