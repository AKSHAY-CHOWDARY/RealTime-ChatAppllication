import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosWithToken from '../../axiosWithToken'
import { toast } from "react-toastify";

export const loadMessagesthunk = createAsyncThunk('loadMessages', async (data, thunkApi) => {
    try {
        let myobj = { _id: data.currentUser._id };
        let selectedUserId = data.selectedUser._id;
        console.log(myobj);
        console.log(selectedUserId);
        const res = await axiosWithToken.post(`http://localhost:4000/messages-api/${selectedUserId}`, myobj);
        
        if (res.data?.message === "All messages") {
            return res.data;
        } else {
            toast.error(res.data?.message || "Error in loading messages");
            return thunkApi.rejectWithValue(res.data?.message || "Error in loading messages");
        }
    } catch (error) {
        toast.error(error.message || "!Network error");
        return thunkApi.rejectWithValue(error.message);
    }
});

export const loadUsersthunk = createAsyncThunk('loadUsers', async (data, thunkApi) => {
    try {
        let obj = { email: data.email };

        const res = await axiosWithToken.post('http://localhost:4000/user-api/users', obj);

        if (res.data?.message === "all users") {
            return res.data;
        } else {
            toast.error(res.data?.message || "Error in loading users");
            return thunkApi.rejectWithValue(res.data?.message || "Error in loading users");
        }
    } catch (error) {
        toast.error(error.message || "Network error");
        return thunkApi.rejectWithValue(error.message);
    }
});

export const chatSlice = createSlice({
    name: 'chat-slice',
    initialState: {
        selectedUser: {},
        messages: [],
        users: [],
        isLoadingMessages: false,
        isLoadingUsers: false,
    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(loadUsersthunk.pending, (state) => {
                state.isLoadingUsers = true;
            })
            .addCase(loadUsersthunk.fulfilled, (state, action) => {
                state.isLoadingUsers = false;
                state.users = action.payload?.payload;
            })
            .addCase(loadUsersthunk.rejected, (state) => {
                state.isLoadingUsers = false;
            })
            .addCase(loadMessagesthunk.pending, (state) => {
                state.isLoadingMessages = true;
            })
            .addCase(loadMessagesthunk.fulfilled, (state, action) => {
                state.isLoadingMessages = false;
                state.messages = action.payload?.payload;
            })
            .addCase(loadMessagesthunk.rejected, (state) => {
                state.isLoadingMessages = false;
            }),
});

export const { setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
