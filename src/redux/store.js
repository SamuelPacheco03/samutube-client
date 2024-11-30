import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import video from "./reducers/video";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    video
  },
  // No es necesario agregar thunk manualmente
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
