import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadMessagesthunk, updateMessages } from "../redux/slices/chatSlice";
import { IoIosSend } from "react-icons/io";
import { useForm } from "react-hook-form";
import axiosWithToken from "../axiosWithToken";
import MessageSkeleton from "../helpers/MessagesSkeleton";
import { toast } from "react-toastify";

function ChatContainer() {
	const { messages, selectedUser, isLoadingMessages } = useSelector(
		(state) => state.chatState
	);
	const { currentUser, socket } = useSelector((state) => state.userLogin);
	const { register, handleSubmit, reset } = useForm();
	const dispatch = useDispatch();
	const messageEndRef = useRef(null);

	// Load Messages Function
	const loadMessages = async () => {
		try {
			const actionObj = loadMessagesthunk({
				selectedUser,
				currentUser,
				socket,
			});
			dispatch(actionObj);
		} catch (error) {
			console.error("Error loading messages:", error);
			toast.error("Failed to load messages. Please try again.");
		}
	};

	// Scroll to Bottom on New Message
	useEffect(() => {
		if (messageEndRef.current && messages) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Handle Real-time Messages
	useEffect(() => {
		loadMessages();
		const handleMessage = (message) => {
			try {
				dispatch(updateMessages(message));
			} catch (error) {
				console.error("Error handling real-time message:", error);
				toast.error("An error occurred while updating messages.");
			}
		};

		socket.on("newMessage", handleMessage);
		return () => {
			socket.off("newMessage", handleMessage);
		};
	}, [socket, selectedUser, dispatch]);

	// Send Message Function
	const sendMessage = async (data) => {
		if (!data.text.trim()) {
			toast.warn("Message cannot be empty.");
			return;
		}

		try {
			const payload = {
				text: data.text,
				_id: currentUser._id,
			};

			const response = await axiosWithToken.post(
				`${process.env.REACT_APP_BACKEND_BASE_URL}/messages-api/send/${selectedUser._id}`,
				payload
			);

			if (response.data.message === "Message sent successfully") {
				toast.success("Message sent successfully.");
				loadMessages();
				reset();
			} else {
				toast.error("Failed to send the message. Please try again.");
			}
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("An error occurred while sending the message.");
		}
	};

	return (
		<div className="w-full flex-1 h-full flex flex-col overflow-auto">
			<div className="p-3 flex space-x-3 items-center bg-[#e0dcd0]">
				<div>
					<img
						class="w-16 h-16 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
						src="https://tse2.mm.bing.net/th?id=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&pid=Api&P=0&h=180"
						alt="User Avatar"
					/>
				</div>
				<p className="text-xl text-black font-mono font-semibold">
					{selectedUser.username || "Unknown User"}
				</p>
			</div>
			{isLoadingMessages ? (
				<div className="w-full h-full overflow-auto">
					<MessageSkeleton />
				</div>
			) : (
				<div className="p-4 flex-1 overflow-y-auto space-y-4 bg-fourth">
					{messages?.length ? (
						messages.map((message, index) => (
							<div
								className={`chat ${
									message.senderId !== currentUser._id
										? "chat-start"
										: "chat-end"
								}`}
								key={index}
								ref={index === messages.length - 1 ? messageEndRef : null}
							>
								<div className="chat-image avatar">
									<div className="w-10 rounded-full">
										<img
											src="https://tse2.mm.bing.net/th?id=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&pid=Api&P=0&h=180"
											alt="User Avatar"
										/>
									</div>
								</div>
								<div className="chat-header">
									{message.senderId === currentUser._id
										? currentUser.username
										: selectedUser.username}
									<time className="text-xs mx-1 opacity-50">
										{new Date(message.timestamp || "").toLocaleTimeString(
											"en-US",
											{
												hour: "2-digit",
												minute: "2-digit",
												hour12: true,
											}
										)}
									</time>
								</div>
								<div
									className={`chat-bubble ${
										message.senderId !== currentUser._id
											? "bg-secondary"
											: "bg-primary"
									} text-white`}
								>
									{message.text}
								</div>
								<div className="chat-footer opacity-50">Delivered</div>
							</div>
						))
					) : (
						<p className="text-center text-gray-500">No messages yet</p>
					)}
				</div>
			)}
			<div className="p-3">
				<form onSubmit={handleSubmit(sendMessage)}>
					<div className="flex space-x-2 relative">
						<input
							type="text"
							className="bg-white outline-primary focus:outline-primary p-2 rounded-md w-full border-2 border-secondary"
							{...register("text")}
							placeholder="Send a message"
						/>
						<button type="submit" className="absolute right-2 top-2">
							<IoIosSend size={25} />
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ChatContainer;
