import React, { useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { Navigate } from "react-router"; // Corrected to use 'react-router-dom'
import axios from "axios";
import { RiLockPasswordFill } from "react-icons/ri";
import BoxComponent from "../helpers/BoxComponent";

function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [redirect, setRedirect] = useState(false); // State for redirection

	const SignupUser = async (data) => {
		try {
			const res = await axios.post(
				`${process.env.REACT_APP_BACKEND_BASE_URL}/user-api/register`,
				data
			);
			if (res.data.message === "User registered successfully") {
				toast.success("Successfully registered!", { position: "top-center" });
				setRedirect(true); // Trigger redirection
			} else {
				toast.error(res.data.message || "Registration failed.", {
					position: "top-center",
				});
			}
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Network error!";
			toast.error(errorMessage, { position: "top-center" });
		}
	};

	// Redirect after successful registration
	if (redirect) {
		return <Navigate to="/" />;
	}

	return (
		<div className="flex h-screen justify-center bg-secondary">
			<ToastContainer />
			<div className="left ml-10 mr-10 min-w-[50%] flex flex-col justify-center items-center">
				<div className="flex flex-col justify-center items-center  min-w-[60%]">
					<IoMdChatbubbles color="#051622" size={70} />
					<h1 className="text-black text-4xl font-sans font-bold">Welcome!</h1>
					<p className="text-black text-lg">Create a new account</p>
				</div>
				<div className="flex flex-col justify-center items-center">
					<form
						className="m-5 text-black w-full"
						onSubmit={handleSubmit(SignupUser)}
					>
						{/* Email Field */}
						<div className="mb-6 ">
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
									{...register("email", { required: "Email is required" })}
									id="input-group-1"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="name@flowbite.com"
								/>
							</div>
							{errors.email && (
								<p className="text-red-500">{errors.email.message}</p>
							)}
						</div>

						{/* Username Field */}
						<div className="mb-6">
							<label
								for="website-admin"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Username
							</label>
							<div class="flex">
								<span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
									<svg
										class="w-4 h-4 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
									</svg>
								</span>
								<input
									type="text"
									id="website-admin"
									{...register("username", {
										required: "Username is required",
									})}
									class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="elonmusk"
								/>
							</div>
							{errors.username && (
								<p className="text-red-500">{errors.username.message}</p>
							)}
						</div>

						{/* Password Field */}
						<div className="mb-6">
							<label
								htmlFor="password"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
									<RiLockPasswordFill color="#9CA3AF" />
								</div>
								<input
									type="password"
									id="password"
									{...register("password", {
										required: "Password is required",
									})}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="password"
								/>
							</div>
							{errors.password && (
								<p className="text-red-500">{errors.password.message}</p>
							)}
						</div>

						{/* Submit Button */}
						<div className="text-center">
							<button
								type="submit"
								className="text-white bg-primary px-4 py-2 rounded-md hover:bg-hoverColor hover:text-black "
							>
								Sign Up
							</button>
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

export default Register;
