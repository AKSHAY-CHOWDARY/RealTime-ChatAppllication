import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const userLoginThunk = createAsyncThunk('userLogin',async(userCred,thunkApi)=>{
    let res;
    res=await axios.post('http://localhost:4000/user-api/login',userCred);
    if(res.data.message=='Login success'){
        sessionStorage.setItem('token',res.data.token)
        return res.data;
    }else{
        return thunkApi.rejectWithValue(res.data.message)
    }
})

export const userSlice = createSlice({
    name:"user-login-slice",
    initialState:{isPending:false,currentUser:null,errStatus:false,errMessage:'',loginStatus:false},
    reducers:{
        resetState:(state,action)=>{
            state.currentUser=null;
            state.isPending=false;
            state.errStatus=false;
            state.errMessage='';
            state.loginStatus=false;
        }
    },
    extraReducers:builder=>builder
    .addCase(userLoginThunk.pending,(state,action)=>{
        state.isPending=true;
    })
    .addCase(userLoginThunk.fulfilled,(state,action)=>{
        state.isPending=false;
        state.currentUser=action.payload.payload; //we can understand the destructuring of the payload using the redux dev tools 
        state.errStatus=false;
        state.errMessage="";
        state.loginStatus=true;
    })
    .addCase(userLoginThunk.rejected,(state,action)=>{
        state.isPending=false;
        state.currentUser=null;
        state.errStatus=true;
        state.errMessage=action.payload.message;
        state.loginStatus=false;
    })
})

export default userSlice.reducer

export const {resetState} = userSlice.actions