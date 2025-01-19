import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosWithToken from "../../axiosWithToken";
import { toast } from "react-toastify";

// Async thunk to load messages
export const loadMessagesthunk = createAsyncThunk(
	"loadMessages",
	async (data, thunkApi) => {
		try {
			const myobj = { _id: data.currentUser._id };
			const selectedUserId = data.selectedUser._id;

			const res = await axiosWithToken.post(
				`${process.env.REACT_APP_BACKEND_BASE_URL}/messages-api/${selectedUserId}`,
				myobj
			);

			if (res.data?.message === "Messages retrieved successfully") {
				toast.success("Messages loaded successfully!");
				return res.data;
			} else {
				const errorMessage = res.data?.message || "Error in loading messages";
				toast.error(errorMessage);
				return thunkApi.rejectWithValue(errorMessage);
			}
		} catch (error) {
			const errorMessage = error.message || "Network error";
			toast.error(errorMessage);
			return thunkApi.rejectWithValue(errorMessage);
		}
	}
);

// Async thunk to load users
export const loadUsersthunk = createAsyncThunk(
	"loadUsers",
	async (data, thunkApi) => {
		try {
			const obj = { email: data.email };

			const res = await axiosWithToken.post(
				`${process.env.REACT_APP_BACKEND_BASE_URL}/user-api/users`,
				obj
			);

			if (res.data?.message === "Users retrieved successfully") {
				toast.success("Users loaded successfully!");
				return res.data;
			} else {
				const errorMessage = res.data?.message || "Error in loading users";
				toast.error(errorMessage);
				return thunkApi.rejectWithValue(errorMessage);
			}
		} catch (error) {
			const errorMessage = error.message || "Network error";
			toast.error(errorMessage);
			return thunkApi.rejectWithValue(errorMessage);
		}
	}
);

export const chatSlice = createSlice({
	name: "chat-slice",
	initialState: {
		selectedUser: {},
		messages: [],
		users: [],
		isLoadingMessages: false,
		isLoadingUsers: false,
		errorMessages: {
			loadUsersError: "",
			loadMessagesError: "",
		},
	},
	reducers: {
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload;
		},
		updateMessages: (state, action) => {
			state.messages = [...state.messages, action.payload];
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(loadUsersthunk.pending, (state) => {
				state.isLoadingUsers = true;
				state.errorMessages.loadUsersError = ""; // Reset error state
			})
			.addCase(loadUsersthunk.fulfilled, (state, action) => {
				state.isLoadingUsers = false;
				state.users = action.payload?.payload;
			})
			.addCase(loadUsersthunk.rejected, (state, action) => {
				state.isLoadingUsers = false;
				state.errorMessages.loadUsersError =
					action.payload || "Error loading users.";
			})
			.addCase(loadMessagesthunk.pending, (state) => {
				state.isLoadingMessages = true;
				state.errorMessages.loadMessagesError = ""; // Reset error state
			})
			.addCase(loadMessagesthunk.fulfilled, (state, action) => {
				state.isLoadingMessages = false;
				state.messages = action.payload?.payload;
			})
			.addCase(loadMessagesthunk.rejected, (state, action) => {
				state.isLoadingMessages = false;
				state.errorMessages.loadMessagesError =
					action.payload || "Error loading messages.";
			}),
});

export const { setSelectedUser, updateMessages } = chatSlice.actions;

export default chatSlice.reducer;
