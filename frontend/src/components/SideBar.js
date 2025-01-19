import React, { useEffect } from "react";
import { setSelectedUser } from "../redux/slices/chatSlice";
import { loadUsersthunk } from "../redux/slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { IoMdContacts } from "react-icons/io";
import SideBarSkeleton from '../helpers/SideBarSkeleton'

function SideBar() {
	const { currentUser, onlineUsers } = useSelector((state) => state.userLogin);
	let { users, selectedUser,isLoadingUsers } = useSelector((state) => state.chatState);
	const dispatch = useDispatch();
	//console.log(onlineUsers);

	const loadUsers = async () => {
		let actionObj = loadUsersthunk(currentUser);
		dispatch(actionObj);
	};

	useEffect(() => {
		loadUsers();
	}, [onlineUsers]);
	return (
		<div className="pt-3 h-full overflow-auto bg-fourth ">
			<div className="text-xl md:text-2xl font-semibold flex md:space-x-3 items-center justify-center font-mono ">
				<div>
					<IoMdContacts />
				</div>
				 <p className="hidden md:block">Contacts</p>
			</div>
			{
				isLoadingUsers?<div className="bg-gray-300"><SideBarSkeleton/></div>:
			
			<div>
			<div className="overflow-y-auto">
				{users.map((user, index) => (
					<div
						key={index}
						className={`flex md:space-x-2 p-3 hover:bg-secondary cursor-pointer ${
							selectedUser._id == user._id ? "bg-secondary" : ""
						}`}
						onClick={() => {
							dispatch(setSelectedUser(user));
							console.log(selectedUser);
						}}
					>
						<div className="relative">
							<img
								class="w-14 h-14 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
								src="https://tse2.mm.bing.net/th?id=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&pid=Api&P=0&h=180"
							></img>
							{
								onlineUsers.includes(user._id) && <span class="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
							}
						</div>
						<div className="hidden sm:block">
							<p className="text-md font-semibold md:text-lg text-black">
								{user.username}
							</p>
							<p className="hidden text-sm lg:block font-thin text-gray-500">
								{user.email}
							</p>
						</div>
					</div>
				))}
			</div>
			</div>
			}
		</div>
	);
}

export default SideBar;
