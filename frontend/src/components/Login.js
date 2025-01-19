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
import { RiLockPasswordFill } from "react-icons/ri";
import BoxComponent from "../helpers/BoxComponent";

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
				<div className="left ml-10 mr-10 min-w-[50%] flex flex-col justify-center items-center">
					<div className="flex flex-col justify-center items-center min-w-[60%]">
						<IoMdChatbubbles color="#051622" size={70} />
						<h1 className="text-black text-4xl font-sans font-bold ">
							Welcome back!
						</h1>
						<p className="text-black text-lg ">Log in to your account</p>
					</div>
					<div className="flex flex-col justify-center items-center">
						<form
							className="m-5 text-black"
							onSubmit={handleSubmit(signinUser)}
						>
							<label
								for="input-group-1"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Your Email
							</label>
							<div class="relative mb-6">
								<div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
									<svg
										class="w-4 h-4 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 20 16"
									>
										<path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
										<path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
									</svg>
								</div>
								<input
									type="text"
									id="input-group-1"
									{...register("email", { required: true })}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="name@gmail.com"
								></input>
							</div>
							<label
								for="input-group-2"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Password
							</label>
							<div class="relative mb-6">
								<div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
									<RiLockPasswordFill color="#9CA3AF" />
								</div>
								<input
									type="password"
									id="input-group-2"
									{...register("password", { required: true })}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="password"
								></input>
							</div>
							<div className="text-center">
								<button
									type="submit"
									className="text-white bg-primary px-4 py-2 rounded-md hover:bg-hoverColor hover:text-black "
								>
									Sign In
								</button>
							</div>
							<div>
								<p className="text-black">
									Don't have an account?{" "}
									<Link className="text-white font-semibold" to="/signup">
										Create account
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
				<div className="right hidden md:w-full md:h-full md:visible md:flex md:justify-center md:items-center ">
					<BoxComponent />
				</div>
			</div>
		);
	}
}

export default SignIn;

//xl:flex xl:justify-center xl:items-center xl:w-[60%]
