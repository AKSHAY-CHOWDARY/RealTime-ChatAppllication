const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Environment Variables
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "abcxyz"; // Fallback for development

let usersCollection;

// Middleware to inject `usersCollection`
userApp.use((req, res, next) => {
    usersCollection = req.app.get("usersCollection");
    next();
});

// SIGN UP
userApp.post(
    "/register",
    expressAsyncHandler(async (req, res) => {
        try {
            const user = req.body;

            // Check if the email already exists
            const existingUser = await usersCollection.findOne({ email: user.email });
            if (existingUser) {
                return res.status(409).send({ message: "User with the same email already exists!" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(user.password, 7);
            user.password = hashedPassword;

            // Insert user into the database
            await usersCollection.insertOne(user);

            res.status(201).send({
                message: "User registered successfully",
                payload: { username: user.username, email: user.email },
            });
        } catch (error) {
            console.error("Error during registration:", error);
            res.status(500).send({ message: "Internal server error", error: error.message });
        }
    })
);

// LOGIN
userApp.post(
    "/login",
    expressAsyncHandler(async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if the user exists in the database
            const dbUser = await usersCollection.findOne({ email });
            if (!dbUser) {
                return res.status(401).send({ message: "Invalid credentials" });
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, dbUser.password);
            if (!isPasswordValid) {
                return res.status(401).send({ message: "Invalid credentials" });
            }

            // Generate JWT
            const token = jwt.sign({ email: dbUser.email, userId: dbUser._id }, JWT_SECRET, {
                expiresIn: "1d",
            });

            // Exclude password from the response
            const { password: _, ...userData } = dbUser;

            res.send({
                message: "Login successful",
                payload: userData,
                token,
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).send({ message: "Internal server error", error: error.message });
        }
    })
);

// FETCH ALL USERS (except the current user)
userApp.post(
    "/users",
    expressAsyncHandler(async (req, res) => {
        try {
            const { email } = req.body;

            // Find all users except the current user
            const users = await usersCollection
                .find({ email: { $ne: email } })
                .project({ password: 0 }) // Exclude passwords
                .toArray();

            res.send({
                message: "Users retrieved successfully",
                payload: users,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send({ message: "Internal server error", error: error.message });
        }
    })
);

module.exports = userApp;
