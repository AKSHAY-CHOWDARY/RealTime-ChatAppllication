import React from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { userLoginThunk } from "../redux/slices/userLoginSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Loader from "../helpers/Loader";

function SignIn() {
	const { register, handleSubmit } = useForm();
	let navigate = useNavigate();
	let [err, setErr] = useState("");
	const dispatch = useDispatch();
	let { isPending, errStatus, errMessage, currentUser, loginStatus } =
		useSelector((state) => state.userLogin);

	const signinUser = async (data) => {
		const actionObj = userLoginThunk(data);
		dispatch(actionObj);
	};

	useEffect(() => {
		if (loginStatus === true) {
			console.log(currentUser);
			navigate("/home");
		}
	}, [loginStatus]);
	
	if (isPending) {
		return <Loader />;
	} else {
		return (
			<div className="flex h-screen justify-center bg-secondary">
				<ToastContainer />
				<div className="left m-10 pt-10">
					<div className="flex flex-col justify-center items-center">
						<IoMdChatbubbles color="#E88850" size={70} />
						<h1 className="text-black text-3xl font-sans font-bold ">
							Welcome back!
						</h1>
						<p className="text-black text-md ">Log in to your account</p>
					</div>
					<div>
						<form
							className="m-5 text-gray-500"
							onSubmit={handleSubmit(signinUser)}
						>
							<div>
								<p>Email</p>
								<input
									id="email"
									className="mb-5 px-7 py-1.5 rounded-lg bg-transparent border border-1 border-gray-600 outline-primary"
									type="text"
									placeholder="Example@gmail.com"
									{...register("email", { required: true })}
								></input>
							</div>

							<div>
								<p>Password</p>
								<input
									id="password"
									className="mb-5 px-7 py-1.5 rounded-lg bg-transparent border border-1 border-gray-600  outline-primary"
									type="password"
									placeholder="Password"
									{...register("password", { required: true })}
								></input>
							</div>
							<div className="text-center">
								<button
									type="submit"
									className="text-black bg-primary px-4 py-2 rounded-md"
								>
									Sign In
								</button>
							</div>
							<div>
								<p className="text-black">
									Don't have an account?{" "}
									<Link className="text-blue-600" to="/signup">
										Create account
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
				<div className="right hidden md:visible md:flex md:justify-center md:items-center xl:flex xl:justify-center xl:items-center xl:w-[50%] ">
					<img src="https://blog.happyfox.com/wp-content/uploads/2020/12/A-Guide-to-In-app-Chat-for-Support-01.png"></img>
				</div>
			</div>
		);
	}
}

export default SignIn;
