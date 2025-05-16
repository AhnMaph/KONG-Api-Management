import { createSlice} from "@reduxjs/toolkit"
export interface user{
    _id:string,
    name:string,
    email:string,
    Islogin:false,
    avatar: string;
    level: number;
}

const initialState = {
    user:null, // cannot directly change
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state,action) => {
            state.user = action.payload;
        },
        logout:(state)=>{
            state.user = null;
        }
    }
});
export const {login,logout} = userSlice.actions;
export const selectUser = (state: { user: { user: user | null } }) => state.user.user;
export default userSlice.reducer; 