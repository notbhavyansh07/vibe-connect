import axios from "axios";
import { io } from "socket.io-client";

// API Setup
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default API;

// Register User
export const registerUser = async (data) => {
  return await API.post("/auth/register", data);
};

// Login User
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

// Create Post (Vibe)
export const createPost = async (data) => {
  const token = localStorage.getItem("token");
  return await API.post("/posts", data, {
    headers: { Authorization: token }
  });
};

// Real-Time Chat (Socket.IO) Setup
export const socket = io("http://localhost:5000");

export const sendMessage = (msg) => {
  socket.emit("sendMessage", msg);
};

// NOTE: use socket.on("receiveMessage", ...) inside your React components to listen!

