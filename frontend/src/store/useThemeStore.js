import { create } from "zustand";
import { axiosInstance } from "../lib/axios";


export const useThemeStore = create((set, get)=>({
    theme:null,
    setTheme: (themes) => set({ theme:themes }),

}))