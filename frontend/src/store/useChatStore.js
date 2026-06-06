import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { socket } from "../lib/socket";

export const useChatStore = create((set, get) => ({
  isSearching: false,
  searchedUsers: [],
  SelectedUser: null,
  isConversationsLoading: false,
  conversations: [],
  messages: [],

  isMessagesLoading: false,
  onlineUsers: [],

  searchUsers: async (query) => {
    try {
      set({ isSearching: true });

      const res = await axiosInstance.get(`/message/search?query=${query}`);
      set({ searchedUsers: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isSearching: false });
    }
  },
  clearUsers: () => set({ searchedUsers: [] }),

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try {
      const res = await axiosInstance.get("/message/get-chats");
      set({ conversations: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isConversationsLoading: false });
    }
  },
  setSelectedUser: (user) => set({ SelectedUser: user }),

  sendMessages: async (data) => {
    try {
      const { SelectedUser } = get();

      if (!SelectedUser?._id) return;

      const res = await axiosInstance.post(
        `/message/send-message/${SelectedUser._id}`,
        data,
      );

      set((state) => ({
        messages: [...state.messages, res.data.data],
      }));
      

   
    } catch (error) {
      console.log(error.response.data.message);
      toast.error("Message not sent");
    }
  },
  getMessages: async () => {
    try {
      const { SelectedUser } = get();

      console.log(SelectedUser);
      if (!SelectedUser?._id) return;
      set({ isMessagesLoading: true });

      const res = await axiosInstance.get(
        `/message/get-message/${SelectedUser._id}`,
      );

      set({ messages: res.data });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateConversation: (data) =>
  set((state) => {
    const updated = state.conversations.map((chat) => {
      if (chat.conversationId === data.conversationId) {
        return {
          ...chat,
          lastMessage: data.lastMessage,
          lastMessageTime: data.lastMessageTime,
          unreadCount:
            data.unreadCount !== undefined
              ? data.unreadCount
              : chat.unreadCount,
        };
      }
      return chat;
    });

    updated.sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    return { conversations: updated };
  }),
  updateMessageStatus: (messageId, status) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId ? { ...msg, status } : msg,
      ),
    })),
  markMessagesSeen: (senderId) =>
  set((state) => ({
    messages: state.messages.map((msg) =>
      String(msg.senderId) === String(senderId)
        ? { ...msg, status: "seen" }
        : msg
    ),
  })),
}));
