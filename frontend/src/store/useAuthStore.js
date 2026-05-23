import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { socket } from "../lib/socket";
import { useChatStore } from "./useChatStore";




export const useAuthStore = create((set,get) => ({
  
  
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdating: false,
  isBlocking: false,
  isUnBlocking: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data });
      toast.success(res.data.message);
      
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    const {setSelectedUser} =useChatStore.getState()
    try {
      setSelectedUser(null)
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdating: true });

    try {
      const res = await axiosInstance.put("/user/update-profile", formData, {
        withCredentials: true,
      });

      set({ authUser: res.data.user });
      toast.success(res.data.message);
      set({ previewPic: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdating: false });
    }
  },
  
}));

export default useAuthStore;
