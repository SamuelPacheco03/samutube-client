import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

// Estado inicial
const initialState = {
  videos: [],
  video: {},
  suscribers:0,
  loading: false,
  error_message: null,
  suscribed: false,
  ownVideo:false
};

// Slice de videos
export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    // Acción para iniciar la carga
    SET_VIDEO_LOADING: (state) => {
      state.loading = true;
    },

    // Acción para finalizar la carga
    REMOVE_VIDEO_LOADING: (state) => {
      state.loading = false;
    },

    // Acción para limpiar el mensaje de error
    REMOVE_VIDEO_ERROR: (state) => {
      state.error_message = null;
    },

    // Acción para obtener todos los videos
    GET_VIDEOS_SUCCESS: (state, action) => {
      state.videos = action.payload;
      state.loading = false;
      state.error_message = null;
    },

    // Acción de fallo al obtener videos
    GET_VIDEOS_FAIL: (state, action) => {
      state.error_message = action.payload;
      state.loading = false;
    },

     // Acción para obtener todos los videos
     GET_VIDEO_SUCCESS: (state, action) => {  
      state.video = action.payload[0].video;
      state.suscribers = action.payload[0].suscribers;
      state.suscribed = action.payload[0].suscribed;
      state.ownVideo = action.payload[0].ownVideo;
      state.loading = false;
      state.error_message = null;
    },

    GET_LIKE_SUCCESS: (state, action) => {  
      console.log(action.payload[0]);
      state.video = action.payload[0];
      state.loading = false;
      state.error_message = null;
    },

    // Acción para suscribirse a un canal
    SUSCRIBED_SUCCESS: (state, action) => {
      state.suscribed = action.payload[0].suscribed; 
      state.suscribers = action.payload[0].suscribers;
    },

    // Acción de fallo al obtener videos
    GET_VIDEO_FAIL: (state, action) => {
      state.error_message = action.payload;
      state.loading = false;
    },

    // Acción para agregar un nuevo video
    ADD_VIDEO_SUCCESS: (state, action) => {
      state.videos.push(action.payload); // Agregamos el nuevo video a la lista
      state.loading = false;
      state.error_message = null;
    },

    // Acción de fallo al crear un video
    ADD_VIDEO_FAIL: (state, action) => {
      state.error_message = action.payload;
      state.loading = false;
    },

    // Acción para eliminar un video
    DELETE_VIDEO_SUCCESS: (state, action) => {
      state.videos = state.videos.filter((video) => video.id !== action.payload); // Eliminamos el video por ID
      state.loading = false;
      state.error_message = null;
    },

    // Acción de fallo al eliminar un video
    DELETE_VIDEO_FAIL: (state, action) => {
      state.error_message = action.payload.suscribed;
      state.loading = false;
    },

    // Acción para agregar un comentario a un video
    ADD_COMMENT_SUCCESS: (state, action) => {
      const updatedVideo = action.payload;
      state.video = updatedVideo; // Actualizamos el video con los nuevos comentarios
      state.loading = false;
      state.error_message = null;
    },

    // Acción para eliminar un comentario de un video
    REMOVE_COMMENT_SUCCESS: (state, action) => {
      const updatedVideo = action.payload;
      state.video = updatedVideo; // Actualizamos el video sin el comentario eliminado
      state.loading = false;
      state.error_message = null;
    },

  },
});

// Exportación de las acciones
export const {
  SET_VIDEO_LOADING,
  REMOVE_VIDEO_LOADING,
  REMOVE_VIDEO_ERROR,
  GET_VIDEOS_SUCCESS,
  GET_VIDEOS_FAIL,
  GET_VIDEO_SUCCESS,
  GET_LIKE_SUCCESS,
  GET_VIDEO_FAIL,
  ADD_VIDEO_SUCCESS,
  ADD_VIDEO_FAIL,
  DELETE_VIDEO_SUCCESS,
  DELETE_VIDEO_FAIL,
  ADD_COMMENT_SUCCESS,
  REMOVE_COMMENT_SUCCESS,
  SUSCRIBED_SUCCESS
} = videoSlice.actions;

// Exportamos el reducer
export default videoSlice.reducer;
