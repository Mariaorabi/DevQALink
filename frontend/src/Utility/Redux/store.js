import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from './Slices/AuthSlice'
import FaceIoReducer from './Slices/FaceIoSlice'
export const store = configureStore({
    reducer: {
      auth : AuthReducer,
      faceIo : FaceIoReducer
        // Add reducers here
    }
})