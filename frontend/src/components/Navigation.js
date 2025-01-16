import React from "react";
import { IoIosSettings } from "react-icons/io";
import { IoMdChatbubbles } from "react-icons/io";
import { resetState } from "../redux/slices/userLoginSlice";
import { useSelector ,useDispatch} from "react-redux";
import { IoIosLogOut } from "react-icons/io";
import {useNavigate} from 'react-router'

function Navigation() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const logout = () => {
		sessionStorage.removeItem("token");
		let actionObj = resetState();
		dispatch(actionObj)
		navigate('/');
	};
	const { loginStatus } = useSelector((state) => state.userLogin);

	return (
		<div className="bg-primary p-4">
			<nav className="flex justify-between items-center">
				<div className="flex space-x-2">
					<IoMdChatbubbles color="#FAE7DC" size={30} />
					<p className="text-black font-bold font-mono text-xl">Chat</p>
				</div>
				<div className="flex space-x-4">
					<div className="flex space-x-1 justify-center items-center md:bg-secondary text-black px-2 py-1 md:rounded-md">
						<IoIosSettings size={20} />
						<p className="hidden md:block font-mono text-sm cursor-pointer">
							Settings
						</p>
					</div>
					{loginStatus ? (
						<div>
							<button
								className="bg-secondary text-black px-4 py-2 rounded-lg hover:bg-white hover:text-primary flex space-x-1 justify-center items-center"
								onClick={logout}
							>
								<p>Logout</p> <IoIosLogOut size={18} />
							</button>
						</div>
					) : (
						<></>
					)}
				</div>
			</nav>
		</div>
	);
}

export default Navigation;
