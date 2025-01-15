import React from "react";
import { IoIosSettings } from "react-icons/io";
import { IoMdChatbubbles } from "react-icons/io";
function Navigation() {
	return (
		<div className="bg-primary p-4">
			<nav className="flex justify-between items-center">
        <div className="flex space-x-2">
				<IoMdChatbubbles color="#FAE7DC" size={30} />
        <p className="text-black font-bold font-mono text-xl">Chat</p>
        </div>

				<div className="flex space-x-1 justify-center items-center md:bg-secondary text-black px-2 py-1 md:rounded-md">
					<IoIosSettings size={20} />
					<p className="hidden md:block font-mono text-sm">Settings</p>
				</div>
			</nav>
		</div>
	);
}

export default Navigation;
