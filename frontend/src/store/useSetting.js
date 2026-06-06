import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useSettingStore = create((set) => ({
  emailChangeloading: false,
  passwordChangeloading: false,
  isDeletingAccount: false,
  isBlockingUser: false,
  changeEmail: async ({ email, password }) => {
    set({ emailChangeloading: true });

    try {
      const res = await axiosInstance.put("user/change-email", {
        email,
        password,
      });

      toast.success(res.data.message);

      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;

      toast.error(msg);

      throw new Error(msg);
    } finally {
      set({ emailChangeloading: false });
    }
  },
  changePassword: async ({ oldPassword, newPassword, confirmPassword }) => {
    set({ passwordChangeloading: true });

    try {
      const res = await axiosInstance.put("/user/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      toast.success(res.data.message);

      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;

      toast.error(msg);

      throw new Error(msg);
    } finally {
      set({ passwordChangeloading: false });
    }
  },
  forgotPassword: async ({ email }) => {
    set({ passwordChangeloading: true });

    try {
      const res = await axiosInstance.post("/auth/forgot-password", {
        email,
      });

      toast.success(res.data.message);

      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;

      toast.error(msg);

      throw new Error(msg);
    } finally {
      set({ passwordChangeloading: false });
    }
  },
  deleteAccount: async (password) => {
    set({ isDeletingAccount: true });

    try {
      const res = await axiosInstance.delete("/user/delete-account", {
        data: { password },
      });

      toast.success(res.data.message);

      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;

      toast.error(msg);

      throw new Error(msg);
    } finally {
      set({ isDeletingAccount: false });
    }
  },
  toggleBlockUser: async (userId) => {
    try {
      set({ isBlockingUser: true });

      const res = await axiosInstance.patch(`/user/block/${userId}`);

      const { blocked } = res.data;

      const authUser = useAuthStore.getState().authUser;

      if (blocked) {
        useAuthStore.setState({
          authUser: {
            ...authUser,
            blockedUser: [...authUser.blockedUser, userId],
          },
        });
      } else {
        useAuthStore.setState({
          authUser: {
            ...authUser,
            blockedUser: authUser.blockedUser.filter(
              (id) => id.toString() !== userId
            ),
          },
        });
      }

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isBlockingUser: false });
    }
  },
}));
