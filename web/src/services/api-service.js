import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000/api",
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export function register(user) {
  return http.post("/users", user);
}

export function login(email, password) {
  return http.post("/sessions", { email, password });
}

export function logout() {
  return http.delete("/sessions");
}

// Users

export function getProfile() {
  return http.get("/users/me");
}

export function updateProfile(data) {
  return http.patch("/users/me", data);
}

export function getUser(id) {
  return http.get(`/users/${id}`);
}

// Projects

export function createProject(project) {
  return http.post("/projects", project);
}

export function listProjects(filters) {
  return http.get("/projects", { params: filters });
}

export function getProject(id) {
  return http.get(`/projects/${id}`);
}

export function updateProject(id, data) {
  return http.patch(`/projects/${id}`, data);
}

export function deleteProject(id) {
  return http.delete(`/projects/${id}`);
}

// Reviews

export function createReview(projectId, review) {
  return http.post(`/projects/${projectId}/reviews`, review);
}

export function deleteReview(projectId, reviewId) {
  return http.delete(`/projects/${projectId}/reviews/${reviewId}`);
}

// Messages

export function sendMessage(userId, message) {
  return http.post(`/users/${userId}/messages`, message);
}

export function deleteMessage(userId, messageId) {
  return http.delete(`/users/${userId}/messages/${messageId}`);
}
