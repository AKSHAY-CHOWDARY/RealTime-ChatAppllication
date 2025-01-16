import React, { useEffect } from "react";
import { setSelectedUser } from "../redux/slices/chatSlice";
import { loadUsersthunk } from "../redux/slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { IoMdContacts } from "react-icons/io";
import { useState } from "react";

function SideBar() {
	const { currentUser } = useSelector((state) => state.userLogin);
	const { users,selectedUser } = useSelector((state) => state.chatState);
	const dispatch = useDispatch();

	const loadUsers = async () => {
		let actionObj = loadUsersthunk(currentUser);
		dispatch(actionObj);
	};

	useEffect(() => {
		loadUsers();
	}, []);



	return (
		<div className="pt-3 h-full overflow-auto bg-gray-100 ">
			<div className="text-xl md:text-2xl font-semibold flex space-x-3 items-center justify-center font-mono ">
				<IoMdContacts /> <p>Contacts</p>
			</div>
			<div className="overflow-y-auto">
			{users.map((user, index) => (
				<div key={index} className={`flex space-x-2 p-3 hover:bg-secondary cursor-pointer ${selectedUser._id==user._id?"bg-secondary":""}`} onClick={()=>{
					dispatch(setSelectedUser(user));
					console.log(selectedUser);
					}} >
					<img
						className="w-8 md:w-14 rounded-full"
						src="https://tse2.mm.bing.net/th?id=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&pid=Api&P=0&h=180"
					></img>
					<div>
						<p className="text-md font-semibold md:text-lg text-black">{user.username}</p>
						<p className="hidden text-sm md:block font-thin text-gray-500">{user.email}</p>
					</div>
				</div>
			))}
			</div>
		</div>
	);
}

export default SideBar;
