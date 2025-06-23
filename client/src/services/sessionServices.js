// src/services/sessionServices.js
import axios from "../lib/axios";

export const scheduleSession = async ({ mentorId, sessions }) => {
  const payload = {
    mentorId,
    sessions
  };

  return axios.post("/sessions", payload);
};


export const getMySessions = () => axios.get("/sessions/");
export const submitFeedback = (id, body) => axios.put(`/sessions/${id}/feedback`, body);