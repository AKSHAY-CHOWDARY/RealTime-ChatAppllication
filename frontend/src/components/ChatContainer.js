import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadMessagesthunk } from "../redux/slices/chatSlice";
import { IoIosSend } from "react-icons/io";
import { useForm } from "react-hook-form";
import axiosWithToken from "../axiosWithToken";
import MessageSkeleton from "../helpers/MessagesSkeleton";
import { useRef } from "react";

function ChatContainer() {
	let { messages, selectedUser, isLoadingMessages } = useSelector(
		(state) => state.chatState
	);
	const messageEndRef = useRef(null);
	const { currentUser } = useSelector((state) => state.userLogin);
	const { register, handleSubmit, reset } = useForm();
	const dispatch = useDispatch();
	const loadMessages = () => {
		let actionObj = loadMessagesthunk({
			selectedUser: selectedUser,
			currentUser: currentUser,
		});
		dispatch(actionObj);
	};

	useEffect(() => {
		if (messageEndRef.current && messages) {
			messageEndRef.current.scrollIntoView({ behaviour: "smooth" });
		}
	}, [messages]);

	const sendMessage = async (data) => {
		console.log(data);
		let obj = {
			text: data.text,
			_id: currentUser._id,
		};
		let res = await axiosWithToken.post(
			`http://localhost:4000/messages-api/send/${selectedUser._id}`,
			obj
		);
		console.log(res);
		reset();
		loadMessages();
	};

	useEffect(() => {
		loadMessages();
	}, [selectedUser]);

	return (
		<div className="w-full flex-1 h-full flex flex-col overflow-auto">
			<div className="p-3 flex space-x-3 items-center bg-gray-100">
				<div>
					<img
						className="w-16 rounded-full"
						src="https://tse2.mm.bing.net/th?id=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&pid=Api&P=0&h=180"
					></img>
				</div>
				<p className="text-xl text-black font-mono font-semibold">
					{selectedUser.username}
				</p>
			</div>
			{isLoadingMessages ? (
				<div className="w-full h-full overflow-auto">
					<MessageSkeleton />
				</div>
			) : (
				<div className="p-4 flex-1 overflow-y-auto space-y-4 ">
					{messages.map((message, index) => {
						if (message.senderId != currentUser._id) {
							return (
								<div className="chat chat-start" ref={messageEndRef}>
									<div className="chat-image avatar">
										<div className="w-10 rounded-full">
											<img
												alt="Tailwind CSS chat bubble component"
												src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
											/>
										</div>
									</div>
									<div className="chat-header">
										{selectedUser.username}
										<time className="text-xs mx-1 opacity-50">
											{new Date(
												message.timestamp ? message.timestamp : ""
											).toLocaleTimeString("en-US", {
												hour: "2-digit", // Display 2-digit hour
												minute: "2-digit", // Display 2-digit minute
												hour12: true, // Use 12-hour format
											})}
										</time>
									</div>
									<div className="chat-bubble bg-primary text-black">
										{message.text}
									</div>
									<div className="chat-footer opacity-50">Delivered</div>
								</div>
							);
						} else {
							return (
								<div className="chat chat-end">
									<div className="chat-image avatar">
										<div className="w-10 rounded-full">
											<img
												alt="Tailwind CSS chat bubble component"
												src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
											/>
										</div>
									</div>
									<div className="chat-header">
										{currentUser.username}
										<time className="text-xs mx-1 opacity-50">
											{new Date(
												message.timestamp ? message.timestamp : ""
											).toLocaleTimeString("en-US", {
												hour: "2-digit", // Display 2-digit hour
												minute: "2-digit", // Display 2-digit minute
												hour12: true, // Use 12-hour format
											})}
										</time>
									</div>
									<div className="chat-bubble bg-primary text-black">
										{message.text}
									</div>
								</div>
							);
						}
					})}
				</div>
			)}
			<div className=" p-3  ">
				<form onSubmit={handleSubmit(sendMessage)}>
					<div className="flex space-x-2 relative">
						<input
							type="text"
							className="bg-white  outline-primary focus:outline-primary  p-2 rounded-md w-full border-2 border-secondary  "
							{...register("text")}
							placeholder="send a message"
						></input>
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
