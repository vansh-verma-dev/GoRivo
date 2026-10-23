const { signup, getUsers, loginUser, getProfile, Logout } = require("../controller/auth.controller");
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/signup" , signup);

router.post("/login", loginUser);

router.get("/users" , getUsers);

router.get("/me", authMiddleware, getProfile);

router.post("/logout", authMiddleware, Logout);

router.get(
    "/passenger-only",
    authMiddleware,
    roleMiddleware("passenger"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Passenger access granted",
            user: req.user,
        });
    }
);

module.exports = router