import axios from "axios";
import { io } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

// API Setup
const API = axios.create({
  baseURL: API_URL
});

export default API;

// Register User
export const registerUser = async (data) => {
  return await API.post("/auth/register", data);
};

// Login User
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  if (typeof window !== 'undefined') {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

// Create Post (Vibe)
export const createPost = async (data) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return await API.post("/posts", data, {
    headers: { Authorization: token }
  });
};

// Real-Time Chat (Socket.IO) Setup - Only connect if SOCKET_URL is provided
export const socket = SOCKET_URL ? io(SOCKET_URL) : null;

export const sendMessage = (msg) => {
  if (socket) socket.emit("sendMessage", msg);
};
