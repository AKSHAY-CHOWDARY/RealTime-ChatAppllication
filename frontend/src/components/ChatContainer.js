import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadMessagesthunk } from "../redux/slices/chatSlice";
import { IoIosSend } from "react-icons/io";
import {useForm} from 'react-hook-form'
import axiosWithToken from "../axiosWithToken";

function ChatContainer() {
	const { messages, selectedUser } = useSelector((state) => state.chatState);
	const { currentUser } = useSelector((state) => state.userLogin);
  const {register,handleSubmit} = useForm();
	const dispatch = useDispatch();
	const loadMessages = () => {
		let actionObj = loadMessagesthunk({
			selectedUser: selectedUser,
			currentUser: currentUser,
		});
		dispatch(actionObj);
	};

  const sendMessage = async(data)=>{
    console.log(data);
    let obj = {
      text:data.text,
      _id:currentUser._id
    }
    let res = await axiosWithToken.post(`http://localhost:4000/messages-api/send/${selectedUser._id}`,obj);
    console.log(res);
  }

	useEffect(() => {
		loadMessages();
	}, [selectedUser]);

	return (
		<div className="w-full flex-1 h-full flex flex-col overflow-auto">
			<div className="p-3 flex space-x-3 items-center">
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
			<div className="p-4 flex-1 overflow-y-auto space-y-4 ">
				{messages.map((message, index) => {
					if (message.senderId != currentUser._id) {
						return (
							<div className="flex space-x-3 items-center p-3 m-0" key={index}>
								<img
									className="w-8 rounded-full"
									src="https://tse2.mm.bing.net/th?id=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&pid=Api&P=0&h=180"
								></img>
								<p className="text-black text-md">{message.text}</p>
							</div>
						);
					} else {
						return (
							<div className="flex space-x-3 items-center justify-end p-3" key={index}>
								<p className="text-black text-md">{message.text}</p>
								<img
									className="w-8 rounded-full"
									src="https://tse2.mm.bing.net/th?id=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&pid=Api&P=0&h=180"
								></img>
							</div>
						);
					}
				})}
			</div>
      <div className="message-container p-3  ">
        <form onSubmit={handleSubmit(sendMessage)}>
          <div className="flex space-x-2 relative">
        <input type="text" className=" p-2 rounded-md w-full border-2 border-secondary outline-primary focus:outline-primary  " {...register("text")} placeholder="send a message"></input>
          <button type="submit" className="absolute right-2 top-2" ><IoIosSend size={25} /></button>
        </div>
        </form>
      </div>
		</div>
	);
}

export default ChatContainer;
