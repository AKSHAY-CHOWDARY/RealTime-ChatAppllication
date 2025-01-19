const exp = require("express");
const expressAsyncHandler = require("express-async-handler");
const { getReceiverSocketId, io } = require("../socket");

const msgsApp = exp.Router();

let msgsCollection;

// Middleware to inject `msgsCollection`
msgsApp.use((req, res, next) => {
	msgsCollection = req.app.get("msgsCollection");
	next();
});

// SEND MESSAGE
msgsApp.post(
	"/send/:id",
	expressAsyncHandler(async (req, res) => {
		try {
			const senderId = req.body._id;
			const receiverId = req.params.id;
			const text = req.body.text;

			if (!senderId || !receiverId || !text) {
				return res.status(400).send({ message: "Missing required fields" });
			}

			const timestamp = new Date().toISOString();
			const message = {
				senderId,
				receiverId,
				text,
				timestamp,
			};

			// Emit message via socket
			try {
				const receiverSocketId = getReceiverSocketId(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("newMessage", message);
					console.log("Message emitted to receiver:", receiverSocketId);
				}
			} catch (socketError) {
				console.error("Socket error:", socketError);
			}

			// Save message to database
			const dbres = await msgsCollection.insertOne(message);

			return res.status(201).send({
				message: "Message sent successfully",
				insertStatus: dbres,
				data: message,
			});
		} catch (error) {
			console.error("Error sending message:", error);
			return res.status(500).send({ message: "Internal server error", error: error.message });
		}
	})
);

// GET MESSAGES
msgsApp.post(
	"/:id",
	expressAsyncHandler(async (req, res) => {
		try {
			const senderId = req.body._id;
			const receiverId = req.params.id;

			if (!senderId || !receiverId) {
				return res.status(400).send({ message: "Missing required fields" });
			}

			// Fetch messages from the database
			const messages = await msgsCollection
				.find({
					$or: [
						{ senderId, receiverId },
						{ senderId: receiverId, receiverId: senderId },
					],
				})
				.sort({ timestamp: 1 })
				.toArray();

			return res.status(200).send({ message: "Messages retrieved successfully", payload: messages });
		} catch (error) {
			console.error("Error retrieving messages:", error);
			return res.status(500).send({ message: "Internal server error", error: error.message });
		}
	})
);

module.exports = msgsApp;
