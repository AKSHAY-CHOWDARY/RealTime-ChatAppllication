import React from "react";
import { useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { Navigate } from "react-router";
import axios from "axios";

function Register() {
	const { register, handleSubmit } = useForm();
	let [err, setErr] = useState("");

	const SignupUser = async (data) => {
    
		const res = await axios.post(
			"http://localhost:4000/user-api/register",
			data
		);
		if (res.data.message == "user registered") {
      toast.success('Successfully registered', {
        position: 'top-center',
      });
			Navigate("http://localhost:4000/");
		} else {
			setErr(res.data.message);
      toast.error(err, {
        position: 'top-center',
      });
		}
	};

	return (
		<div className="flex h-screen justify-center bg-secondary">
      <ToastContainer/>
			<div className="left m-10 pt-10">
				<div className="flex flex-col justify-center items-center">
					<IoMdChatbubbles color="#E88850" size={70} />
					<h1 className="text-black text-3xl font-sans font-bold ">
						Welcome back!
					</h1>
					<p className="text-black text-md ">create a new account</p>
				</div>
				<div>
					<form
						className="m-5 text-gray-500"
						onSubmit={handleSubmit(SignupUser)}
					>
						<div>
							<p>Email</p>
							<input
								id="email"
								className="mb-5 px-7 py-1.5 rounded-lg bg-transparent border border-1 border-gray-600 outline-[#5C5BAB]"
								type="text"
								placeholder="Example@gmail.com"
								{...register("email", { required: true })}
							></input>
						</div>
						<div>
							<p>Username</p>
							<input
								id="username"
								className="mb-5 px-7 py-1.5 rounded-lg bg-transparent border border-1 border-gray-600 outline-[#5C5BAB]"
								type="text"
								placeholder="Username"
								{...register("username", { required: true })}
							></input>
						</div>
						<div>
							<p>Password</p>
							<input
								id="password"
								className="mb-5 px-7 py-1.5 rounded-lg bg-transparent border border-1 border-gray-600 outline-[#5C5BAB]"
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
								Sign up
							</button>
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

export default Register;
