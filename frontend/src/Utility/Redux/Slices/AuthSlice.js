import { createSlice } from "@reduxjs/toolkit";

const initialState = {user : {userId : 0, fullName : null, username : null, password : null, email : null, phone : null, role : null}};
const authSlice = createSlice({
  name: "auth",

  initialState,
  reducers : {
    login1: (state, action)=>{
      state.user = action.payload;
    },

    logout : (state)=>{
      state.user = initialState.user;
    }
  },

  selectors : {
    getUser : (state)=> {
      return state.user;
    }
  }
})

export const {login1, logout} = authSlice.actions;

export const {getUser} = authSlice.selectors;
export default authSlice.reducer;