const express = require("express")
const { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser } = require("../Controllers/userController")
const router = express.Router()
const { protect, admin } = require("../Middleware/authMiddleware")

router.route("/login").post(authUser)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile)
router.route("/").get(protect, admin, getUsers)
router.route("/").post(registerUser)
router.route("/:id").delete(protect, admin, deleteUser)
router.route("/:id").get(protect, admin, getUserById)
router.route("/:id").put(protect, admin, updateUser)

module.exports = router
