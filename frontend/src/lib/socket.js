import { io } from "socket.io-client";
const baseURL =  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});