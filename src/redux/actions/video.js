import axios from "axios";
import {
  SET_VIDEO_LOADING,
  REMOVE_VIDEO_LOADING,
  ADD_VIDEO_SUCCESS,
  GET_VIDEOS_SUCCESS,
  GET_VIDEO_SUCCESS,
  GET_LIKE_SUCCESS,
  ADD_VIDEO_FAIL,
  GET_VIDEOS_FAIL,
  GET_VIDEO_FAIL,
  DELETE_VIDEO_SUCCESS,
  DELETE_VIDEO_FAIL,
  REMOVE_VIDEO_ERROR,
  SUSCRIBED_SUCCESS
} from "../reducers/video";
import api from "../../services/authService";

// Acción para obtener todos los videos
export const getVideos = (id) => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/videos${id ? `?channelId=${id}` : ""}`,  // Ruta para obtener los videos en el backend
      { withCredentials: true }
    );
    console.log(res.data.body);
    if (res.status === 200) {
      dispatch(GET_VIDEOS_SUCCESS(res.data.body)); // Responde con la lista de videos
    } else {
      dispatch(GET_VIDEOS_FAIL("Error al obtener los videos"));
    }
  } catch (err) {
    let errorMessage = "Error desconocido al obtener los videos.";
    if (err.response) {
      errorMessage = err.response.data.body || "Error en el servidor.";
    } else if (err.request) {
      errorMessage =
        "No se pudo contactar al servidor. Verifica tu conexión.";
    } else {
      errorMessage = err.message;
    }
    dispatch(GET_VIDEOS_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_VIDEO_LOADING());
  }
};

// Acción para obtener un video por ID
export const getVideoById = (videoId, session) => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());

  try {

    // Determinamos cuál librería usar dependiendo de la sesión
    const axiosInstance = session ? api : axios;
    console.log(axiosInstance);
    console.log('e')
    // Realizamos la solicitud al backend
    const res = await axiosInstance.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/videos/${videoId}`
    );

    if (res.status === 200) {
      console.log(res.data.body);
      dispatch(GET_VIDEO_SUCCESS([res.data.body])); // Responde con el video
    } else {
      dispatch(GET_VIDEO_FAIL("Error al obtener el video"));
    }
  } catch (err) {
    // Manejo de errores más detallado
    let errorMessage = "Error desconocido al obtener el video.";

    if (err.response) {
      // Error proveniente del servidor
      errorMessage = err.response.data.body || "Error en el servidor.";
    } else if (err.request) {
      // Error de red, el servidor no respondió
      errorMessage = "No se pudo contactar al servidor. Verifica tu conexión.";
    } else {
      // Otros errores (p. ej., errores en la solicitud misma)
      errorMessage = err.message;
    }

    dispatch(GET_VIDEOS_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_VIDEO_LOADING());
  }
};

// Acción para crear un nuevo video
export const addVideo = (title, description, file) => async (dispatch) => {
    dispatch(SET_VIDEO_LOADING());
    dispatch(REMOVE_VIDEO_ERROR());
    // Crear FormData para enviar el video y los otros campos
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);  // El archivo de video que se selecciona desde el frontend
  
    try {
      const res = await api.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/videos/create-video`,  // Ruta para crear el video en el backend
        formData,  // Enviamos el FormData con el archivo
        {
          headers: {
            "Content-Type": "multipart/form-data",  // Indicamos que estamos enviando un archivo
          }
        }
      );
      console.log(import.meta.env.VITE_REACT_APP_API_URL);
  
      if (res.status === 201) {
        dispatch(ADD_VIDEO_SUCCESS(res.data.body.newVideo)); // Responde con el video recién creado
      } else {
        dispatch(ADD_VIDEO_FAIL("Error al crear el video"));
      }
    } catch (err) {
      let errorMessage = "Error desconocido al crear el video.";
      if (err.response) {
        errorMessage = err.response.data.body || "Error en el servidor.";
      } else if (err.request) {
        errorMessage =
          "No se pudo contactar al servidor. Verifica tu conexión.";
      } else {
        errorMessage = err.message;
      }
      dispatch(ADD_VIDEO_FAIL(errorMessage));
    } finally {
      dispatch(REMOVE_VIDEO_LOADING());
    }
  };
  
export const suscribe = (channel_id) => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());

  const body = { channel_id };

  try {
    const res = await api.post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/suscribe`,
      body
    );

    if (res.status === 200) {
      dispatch(SUSCRIBED_SUCCESS([res.data.body]));
    }
  } catch (err) {
    let errorMessage = "Error desconocido al suscribirse al canal";
    if (err.response) {
      errorMessage = err.response.data.body || "Error en el servidor.";
    }
    dispatch(ADD_VIDEO_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_VIDEO_LOADING());
  }
};

// Acción para eliminar un video
export const deleteVideo = (videoId) => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/${videoId}`,
      { withCredentials: true }
    );

    if (res.status === 200) {
      dispatch(DELETE_VIDEO_SUCCESS(videoId)); // Responde con el ID del video eliminado
    } else {
      dispatch(DELETE_VIDEO_FAIL("Error al eliminar el video"));
    }
  } catch (err) {
    let errorMessage = "Error desconocido al eliminar el video.";
    if (err.response) {
      errorMessage = err.response.data.body || "Error en el servidor.";
    } else if (err.request) {
      errorMessage =
        "No se pudo contactar al servidor. Verifica tu conexión.";
    } else {
      errorMessage = err.message;
    }
    dispatch(DELETE_VIDEO_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_VIDEO_LOADING());
  }
};

// Acción para agregar un comentario a un video
export const addCommentToVideo = (videoId, text) => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());
  console.log('eehsa')
  const body = { videoId, text };

  try {
    const res = await api.post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/comments`,
      body
    );

    if (res.status === 200) {
      dispatch(GET_VIDEO_SUCCESS([res.data.body.video]));
    } else {
      dispatch(ADD_VIDEO_FAIL("Error al agregar comentario"));
    }
  } catch (err) {
    let errorMessage = "Error desconocido al agregar el comentario.";
    if (err.response) {
      errorMessage = err.response.data.body || "Error en el servidor.";
    } else if (err.request) {
      errorMessage =
        "No se pudo contactar al servidor. Verifica tu conexión.";
    } else {
      errorMessage = err.message;
    }
    dispatch(ADD_VIDEO_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_VIDEO_LOADING());
  }
};

// Acción para eliminar un comentario de un video
export const deleteCommentFromVideo = (videoId, commentId) => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/comments/${videoId}/${commentId}`,
      { withCredentials: true }
    );

    if (res.status === 200) {
      dispatch(GET_VIDEOS_SUCCESS([res.data.body.updatedVideo])); // Devuelve el video actualizado sin el comentario eliminado
    } else {
      dispatch(ADD_VIDEO_FAIL("Error al eliminar el comentario"));
    }
  } catch (err) {
    let errorMessage = "Error desconocido al eliminar el comentario.";
    if (err.response) {
      errorMessage = err.response.data.body || "Error en el servidor.";
    } else if (err.request) {
      errorMessage =
        "No se pudo contactar al servidor. Verifica tu conexión.";
    } else {
      errorMessage = err.message;
    }
    dispatch(ADD_VIDEO_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_VIDEO_LOADING());
  }
};

// Acción para dar like a un video
export const likeVideo = (videoId, like) => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());
  const body = { videoId, like };

  try {
    const res = await api.post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/like-video`,
      body
    );

    if (res.status === 200) {
      console.log(res.data.body.video);
      dispatch(GET_LIKE_SUCCESS([res.data.body.video])); // Devuelve el video actualizado con el like
    } else {
      dispatch(ADD_VIDEO_FAIL("Error al dar like"));
    }
  } catch (err) {
    let errorMessage = "Error desconocido al dar like al video.";
    if (err.response) {
      errorMessage = err.response.data.body || "Error en el servidor.";
    } else if (err.request) {
      errorMessage =
        "No se pudo contactar al servidor. Verifica tu conexión.";
    } else {
      errorMessage = err.message;
    }
    dispatch(ADD_VIDEO_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_VIDEO_LOADING());
  }
};

export const searchVideoByTitle = (title) => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());
  const body = { title };
  try {
    const res = await api.post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/search`, body
    );

    if (res.status === 200) {
      dispatch(GET_VIDEOS_SUCCESS(res.data.body));
    } else {
      dispatch(GET_VIDEOS_FAIL("Error al buscar videos"));
    }
  } catch (err) {
    let errorMessage = "Error desconocido al buscar videos.";
    if (err.response) {
      errorMessage = err.response.data.body || "Error en el servidor.";
    } else if (err.request) {
      errorMessage =
        "No se pudo contactar al servidor. Verifica tu conexión.";
    } else {
      errorMessage = err.message;
    }
    dispatch(GET_VIDEOS_FAIL(errorMessage));
  } finally {
    dispatch(REMOVE_VIDEO_LOADING());
  }
}

export const getVideosBySubscriptions = () => async (dispatch) => {
  dispatch(SET_VIDEO_LOADING());
  dispatch(REMOVE_VIDEO_ERROR());

  try {
    const res = await api.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/videos/subscriptions`
    );

    if (res.status === 200) {
      dispatch(GET_VIDEOS_SUCCESS(res.data.body));
    } else {
      dispatch(GET_VIDEOS_FAIL("Error al obtener videos de suscripciones"));
    }
  } catch (err) {
    let errorMessage = "Error desconocido al obtener videos de suscripciones.";
    if (err.response) {
      errorMessage = err.response.data.body || "Error en el servidor.";
    } else if (err.request) {
      errorMessage =
        "No se pudo contactar al servidor. Verifica tu conexión.";
    } else {
      errorMessage = err.message;
    }
    dispatch(GET_VIDEOS_FAIL(errorMessage));
  }
}