import React from "react"
import { Route } from "react-router"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../actions/userActions"
import SearchBox from "./SearchBox"

const Header = ({ history }) => {
	const { userInfo } = useSelector((state) => state.userLogin)
	const dispatch = useDispatch()
	const logoutHandler = (e) => {
		dispatch(logout(history))
	}

	return (
		<header>
			<Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className="py-1">
				<Container>
					<LinkContainer to="/">
						<Navbar.Brand>EleCTroShOp </Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Route render={({ history }) => <SearchBox history={history} />} />
						<Nav className="ms-auto">
							<LinkContainer to="/cart">
								<Nav.Link>
									<i className="fas fa-shopping-cart"> Cart</i>{" "}
								</Nav.Link>
							</LinkContainer>
							{userInfo ? (
								<NavDropdown title={<i className="fas fa-user-alt"> {userInfo.name}</i>} id="username">
									<LinkContainer to="/profile">
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
								</NavDropdown>
							) : (
								<LinkContainer to="/login">
									<Nav.Link>
										<i className="fas fa-user"> Sign in</i>
									</Nav.Link>
								</LinkContainer>
							)}
							{userInfo && userInfo.isAdmin && (
								<NavDropdown title={<i className="fas fa-users-cog"> Admin</i>} id="admin">
									<LinkContainer to="/admin/userlist">
										<NavDropdown.Item>Users</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to="/admin/productlist">
										<NavDropdown.Item>Products</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to="/admin/orderlist">
										<NavDropdown.Item>Orders</NavDropdown.Item>
									</LinkContainer>
								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	)
}

export default Header
