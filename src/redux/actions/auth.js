import axios from "axios";
import {
  SET_AUTH_LOADING,
  LOGIN_SUCCESS,
  REMOVE_AUTH_LOADING,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
  REMOVE_ERROR_MESSAGE
} from "../reducers/auth";

// Acción para iniciar sesión
export const login =
  (email, password) => async (dispatch) => {
    dispatch(SET_AUTH_LOADING());
    dispatch(REMOVE_ERROR_MESSAGE());
    
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      
    };

    const body = JSON.stringify({
      email,
      password
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/auth/sign-in`,
        body,
        config
      );

      if (res.status === 200) {
        const response = res.data.body;
        dispatch(LOGIN_SUCCESS(response));
      } else {
        dispatch(
          LOGIN_FAIL(res.data.body || "Error desconocido al iniciar sesión.")
        );
      }
    } catch (err) {
      let errorMessage = "Error desconocido al iniciar sesión.";
      if (err.response) {
        errorMessage = err.response.data.body || "Error en el servidor.";
      } else if (err.request) {
        errorMessage =
          "No se pudo contactar al servidor. Verifica tu conexión.";
      } else {
        errorMessage = err.message;
      }
      dispatch(LOGIN_FAIL(errorMessage));
    } finally {
      dispatch(REMOVE_AUTH_LOADING());
    }
  };

//Acción para registrar un usuario
export const signUp =
  (username, email, password) => async (dispatch) => {
    dispatch(SET_AUTH_LOADING());
    dispatch(REMOVE_ERROR_MESSAGE());
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };
    console.log('e')
    const body = JSON.stringify({
      username,
      email,
      password
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/auth/register`,
        body,
        config
      );

      if (res.status === 200) {
        const response = res.data.body; 
        dispatch(REGISTER_SUCCESS(response));
      } else {
        dispatch(
          REGISTER_FAIL(res.data.body || "Error desconocido al tratar de registrarte.")
        );
      }
    } catch (err) {
      let errorMessage = "Error desconocido al registrarte.";
      if (err.response) {
        errorMessage = err.response.data.body || "Error en el servidor.";
      } else if (err.request) {
        errorMessage =
          "No se pudo contactar al servidor. Verifica tu conexión.";
      } else {
        errorMessage = err.message;
      }
      console.log(errorMessage)
      dispatch(REGISTER_FAIL(errorMessage));
    } finally {
      
      dispatch(REMOVE_AUTH_LOADING());
    }
  };

// Acción para cerrar sesión
export const logout = () => async (dispatch) => {
  dispatch(LOGOUT());
  window.location.reload();
};
