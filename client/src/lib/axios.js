import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api", // or your deployed URL
  withCredentials: true,
});

export default instance;
