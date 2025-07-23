import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === error.config.redirectStatus) {

      const redirectPath = error.config.authRedirectPath || '/login';
      window.location.href = redirectPath;
    }

    return Promise.reject(error);
  }
);

export default apiClient;