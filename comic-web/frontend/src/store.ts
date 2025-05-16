import {configureStore} from '@reduxjs/toolkit'
import userReducer from './types/user/userSlice';

export const store = configureStore({
    reducer:{
        user: userReducer
    },
})
export type RootState = ReturnType<typeof store.getState>; // return type of the state
export type AppDispatch = typeof store.dispatch;
export default store;
