import logo from "./logo.svg";
import { BrowserRouter, Routes, Route, Router, Outlet } from "react-router";
import Navigation from "./components/Navigation";
import Register from "./components/Register";
import SignIn from "./components/Login";
import Home from "./components/Home";

import { ToastContainer, toast } from "react-toastify";

function App() {
	return (
		<div className="-mt-3" >
			<ToastContainer/>
			<Navigation />
			<Routes>
				<Route path="/" element={<SignIn/>}/>
				<Route path="/signup" element={<Register/>}/>
				<Route path="/home" element={<Home/>}/>
			</Routes>
		</div>
	);
}

export default App;
