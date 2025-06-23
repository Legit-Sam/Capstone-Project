// src/services/mentorService.js
import axios from "../lib/axios";

export const getMentors = () => axios.get("/users?role=MENTOR");
export const getAvailabilityByMentor = (mentorId) =>
  axios.get(`/availability/${mentorId}`);
export const sendMentorshipRequest = (mentorId) =>
  axios.post("/requests", { mentorId });
export const getSentRequests = () => axios.get("/requests/sent");

export const getReceivedRequests = () => axios.get("/requests/received");

export const updateRequestStatus = (requestId, status) =>
  axios.put(`/requests/${requestId}`, { status })


// src/services/mentorServices.js
export const getMyAvailability = () => axios.get("/availability");

export const upsertAvailability = (data) =>
  axios.post("/availability", data);

export const deleteAvailability = () =>
  axios.delete("/availability/delete");
