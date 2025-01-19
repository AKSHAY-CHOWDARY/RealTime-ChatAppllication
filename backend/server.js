require("dotenv").config(); 
const express = require("express");
const { app, server } = require("./socket");
const path = require("path");
const mongoClient = require("mongodb").MongoClient;

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// Connect to MongoDB
mongoClient
    .connect(MONGO_URI)
    .then((client) => {
        const dbObj = client.db(DB_NAME);
        const usersCollection = dbObj.collection("usersCollection");
        const msgsCollection = dbObj.collection("msgsCollection");

        app.set("usersCollection", usersCollection);
        app.set("msgsCollection", msgsCollection);

        console.log("Connection to database successful");
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

app.use(express.json());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API routes
const userApp = require("./apis/user-api");
const msgsApp = require("./apis/messages-api");

app.use("/user-api", userApp);
app.use("/messages-api", msgsApp);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error encountered:", err);
    res.status(500).send({ errorMessage: err.message || "Internal server error" });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
