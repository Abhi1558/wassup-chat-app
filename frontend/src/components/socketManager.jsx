import { useEffect } from "react";
import { socket } from "../lib/socket";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const SocketManager = () => {
  const { authUser } = useAuthStore();

  console.log("SocketManager rendered");

  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);

  const addMessage = useChatStore((state) => state.addMessage);
  const updateConversation = useChatStore((state) => state.updateConversation);

  useEffect(() => {
    if (!authUser?._id) return;

    socket.connect();

    // after connection register user
    socket.emit("addUser", authUser._id);

    socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    // online users
    socket.on("getOnlineUsers", (users) => {
      console.log("ONLINE USERS:", users);

      setOnlineUsers(users);
    });

    // new real-time message
    socket.on("newMessage", (message) => {
      console.log("📩 NEW MESSAGE:", message);

      const selectedUser = useChatStore.getState().SelectedUser;

      if (selectedUser?._id !== String(message.senderId)) return;

      addMessage(message);
    });
    socket.on("conversationUpdated", (data) => {
      console.log("📌 SIDEBAR UPDATE:", data);

      updateConversation(data);
    });
    socket.on("messageDelivered", ({ messageId }) => {
      useChatStore.getState().updateMessageStatus(messageId, "delivered");
    });

    socket.on("messagesSeen", ({ senderId }) => {
      useChatStore.getState().markMessagesSeen(senderId);
    });

    return () => {
      socket.off("connect");
      socket.off("getOnlineUsers");
      socket.off("newMessage");
      socket.off("conversationUpdated");
      socket.off("messagesSeen");;

      socket.disconnect();
    };
  }, [authUser?._id]);

  return null;
};

export default SocketManager;
