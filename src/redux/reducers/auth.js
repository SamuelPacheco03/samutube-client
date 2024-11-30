import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  session: null,
  loginSuccess: false,
  registerSuccess: false,
  error_message: null,
  loading: false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_AUTH_LOADING: (state) => {
      state.loading = true;
    },
    REMOVE_AUTH_LOADING: (state) => {
      state.loading = false;
    },
    REMOVE_ERROR_MESSAGE: (state) => {
      state.error_message = null;
    },

    LOGIN_SUCCESS: (state, action) => {
      const { session, user, token, refreshToken } = action.payload;
      sessionStorage.setItem('session', session);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      state.user = user;
      state.session = session;
      state.loginSuccess = true
      state.error_message = null;
    },
    REGISTER_SUCCESS: (state, action) => {
      const { session, user, token, refreshToken } = action.payload;
      console.log(action.payload)
      sessionStorage.setItem('session', session);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      state.user = user;
      state.registerSuccess = true;
      state.session = session;
      state.error_message = null;
    },

    REFRESH_SESSION_SUCCESS: (state, action) => {
      const { session, user } = action.payload;
      state.user = user;
      state.session = session;
      state.error_message = null;

    },

    REGISTER_FAIL: (state, action) => {
      state.error_message = action.payload;
      state.session = false;

    },

    LOGIN_FAIL: (state, action) => {
      state.error_message = action.payload;
      sessionStorage.removeItem('session');
      state.session = false;
      state.user = null;
      state.loading = false;

    },

    LOGOUT: (state) => {
      sessionStorage.removeItem('session');
      localStorage.removeItem('session');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      state.session = false;
      state.user = null;
      state.loading = false;
      
    },
  },
});

export const {
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  REFRESH_SESSION_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REMOVE_ERROR_MESSAGE
} = authSlice.actions;

export default authSlice.reducer;
