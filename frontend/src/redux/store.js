import { configureStore } from '@reduxjs/toolkit'
import userLoginReducer from './slices/userLoginSlice'
import chatReducer from './slices/chatSlice'

export default configureStore({
  reducer: {
      userLogin:userLoginReducer,
      chatState:chatReducer
  },
})