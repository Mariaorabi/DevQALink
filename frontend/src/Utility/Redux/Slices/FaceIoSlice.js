
/* global faceIO */
import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {faceIo : null};
const FaceIoSlice = createSlice({
  name: "faceIo",

  initialState,
  reducers : {
    setFaceIo: (state, action)=>{
      state.faceIo = action.payload;
    },

    removeFaceIo : (state)=>{
      state.faceIo = initialState.faceIo;
    }
  },

  selectors : {
    getFaceIo : (state)=> {
      return state.faceIo;
    }
  }
})

export const {setFaceIo, removeFaceIo} = FaceIoSlice.actions;

export const {getFaceIo} = FaceIoSlice.selectors;
export default FaceIoSlice.reducer;