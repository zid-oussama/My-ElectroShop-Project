const express = require("express")
const connectDB = require("./config/DB")
const morgan = require("morgan")
const uploadRoutes = require("./Routes/uploadRoutes")
const { errorHandler, notFound } = require("./Middleware/errorMiddleware")
const path = require("path")
require("dotenv").config()

connectDB()

const app = express()
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"))
}

app.use(express.json())

app.use("/api/products", require("./Routes/productRoutes"))
app.use("/api/users", require("./Routes/userRoutes"))
app.use("/api/orders", require("./Routes/orderRoutes"))
app.use("/api/upload", uploadRoutes)
app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

//static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/build")))
	app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")))
} else {
	app.get("/", (req, res) => {
		res.send("api is running")
	})
}

//error notFound path
app.use(notFound)
//error handler
app.use(errorHandler)

app.listen(process.env.PORT || 5000, console.log(`Listening on port ${process.env.Port}`.yellow.bold.underline))
