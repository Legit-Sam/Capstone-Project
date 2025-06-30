import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SERVER_URI_LOCAL || "http://localhost:3000/api";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
