import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

// Async thunk for user login
export const userLoginThunk = createAsyncThunk(
    "userLogin",
    async (userCred, thunkApi) => {
        try {
            console.log(`${process.env.REACT_APP_BACKEND_BASE_URL}/user-api/login`);
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/user-api/login`, userCred);

            if (res.data.message === "Login successful") {
                // Store token in session storage
                sessionStorage.setItem("token", res.data.token);

                // Initialize socket connection
                let socket;
                try {
                    socket = io(`${process.env.REACT_APP_BACKEND_BASE_URL}`, {
                        query: { userId: res.data.payload._id },
                    });

                    // Listen for online users updates and dispatch to Redux state
                    socket.on("getOnlineUsers", (userIds) => {
                        thunkApi.dispatch(updateOnlineUsers(userIds));
                    });

                    // Notify connection success
                    toast.success("Connected to server and logged in successfully");
                } catch (socketError) {
                    console.error("Socket connection error:", socketError);
                    toast.error("Socket connection failed. Some features may not work.");
                }

                // Return the user data and socket
                return { ...res.data, socket };
            } else {
                // Notify invalid credentials
                toast.error("Invalid credentials. Please check your username and password.");
                return thunkApi.rejectWithValue(res.data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login API error:", err);

            // Handle common errors
            if (err.response) {
                // Server responded with a status code outside the 2xx range
                toast.error(`Login failed: ${err.response.data.message || "Server error"}`);
                return thunkApi.rejectWithValue(err.response.data.message || "Server error");
            } else if (err.request) {
                // Request was made but no response was received
                toast.error("Login failed: No response from the server. Please try again later.");
                return thunkApi.rejectWithValue("No response from server");
            } else {
                // Other errors (e.g., request setup issues)
                toast.error(`Login failed: ${err.message || "Unexpected error"}`);
                return thunkApi.rejectWithValue(err.message || "Unexpected error");
            }
        }
    }
);

export const userSlice = createSlice({
    name: "user-login-slice",
    initialState: {
        isPending: false,
        currentUser: null,
        errStatus: false,
        errMessage: "",
        loginStatus: false,
        socket: null,
        onlineUsers: [],
    },
    reducers: {
        resetState: (state) => {
            state.currentUser = null;
            state.isPending = false;
            state.errStatus = false;
            state.errMessage = "";
            state.loginStatus = false;

            if (state.socket) {
                try {
                    state.socket.disconnect(); // Safely disconnect the socket
                    toast.info("Disconnected from server.");
                } catch (socketError) {
                    console.error("Error disconnecting socket:", socketError);
                }
                state.socket = null;
            }
            state.onlineUsers = [];
        },
        updateOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLoginThunk.pending, (state) => {
                state.isPending = true;
                state.errStatus = false;
                state.errMessage = "";
                toast.info("Logging in...");
            })
            .addCase(userLoginThunk.fulfilled, (state, action) => {
                state.isPending = false;
                state.currentUser = action.payload.payload;
                state.socket = action.payload.socket;
                state.errStatus = false;
                state.errMessage = "";
                state.loginStatus = true;
            })
            .addCase(userLoginThunk.rejected, (state, action) => {
                state.isPending = false;
                state.currentUser = null;
                state.errStatus = true;
                state.errMessage = action.payload || "Login failed";
                state.loginStatus = false;
                state.onlineUsers = [];
                state.socket = null;

                // Notify user of the failure
                toast.error(action.payload || "Login failed. Please try again.");
            });
    },
});

export const { resetState, updateOnlineUsers } = userSlice.actions;

export default userSlice.reducer;
