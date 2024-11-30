import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL
});

// Interceptor para agregar el token de localStorage a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtén el token desde localStorage
    console.log(token) 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Agregar el token al header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de la API
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es un 401 (Unauthorized) y no hemos intentado renovar el token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentamos obtener un nuevo token usando el refresh token
        const refreshToken = localStorage.getItem('refreshToken'); // Obtén el refreshToken de localStorage
        const res = await api.post('/auth/refresh-token', { refreshToken }); // Suponiendo que el refreshToken también esté en localStorage

        if (res.status === 200) {
          const { accessToken } = res.data; // Aquí asumo que el servidor devuelve un nuevo token de acceso
          localStorage.setItem('token', accessToken); // Guardar el nuevo token en localStorage

          // Reintentar la solicitud original con el nuevo token
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest); // Reintentar la solicitud original
        }
      } catch (err) {
        console.error('No se pudo renovar el token de acceso:', err);
        localStorage.removeItem('token'); // Eliminar token si no se puede renovar
        localStorage.removeItem('refreshToken'); // Eliminar el refreshToken si también falla
        window.location.href = '/login'; // Redirigir al login si el refresh token falla
      }
    }

    return Promise.reject(error);
  }
);

export default api;
