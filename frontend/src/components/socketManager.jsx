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
      
    });

    // online users
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // new real-time message
    socket.on("newMessage", (message) => {
      

      const selectedUser = useChatStore.getState().SelectedUser;
      const authUser = useAuthStore.getState().authUser;

      // current chat is not open
      if (String(selectedUser?._id) !== String(message.senderId)) {
        return;
      }

      // show message
      addMessage(message);

      // instantly mark as seen
      socket.emit("markSeen", {
        senderId: message.senderId,
        receiverId: authUser._id,
      });
    });
    socket.on("conversationUpdated", (data) => {
      

      updateConversation(data);
    });
    socket.on("messageDelivered", ({ messageId }) => {
      useChatStore.getState().updateMessageStatus(messageId, "delivered");
    });

    socket.on("messageSeen", ({ messageId }) => {
     

      useChatStore.getState().updateMessageStatus(messageId, "seen");
    });
    return () => {
      socket.off("connect");
      socket.off("getOnlineUsers");
      socket.off("newMessage");
      socket.off("conversationUpdated");
      socket.off("messageSeen");
      socket.off("messageDelivered");

      socket.disconnect();
    };
  }, [authUser?._id]);

  return null;
};

export default SocketManager;
