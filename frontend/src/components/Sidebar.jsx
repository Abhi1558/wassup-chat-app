import React from "react";
import { useChatStore } from "../store/useChatStore";
import { Users } from "lucide-react";
import SidebarSkeleton from "./skeleton/SidebarSkeleton.jsx";
import SearchUser from "./searchUsers.jsx";
import { useEffect } from "react";
import avatar from "../../public/avatar.jpg";

const Sidebar = () => {
  const {
    isConversationsLoading,
    SelectedUser,
    setSelectedUser,
    getConversations,
  } = useChatStore();
  
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  
  const conversations = useChatStore((state) => state.conversations);
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  useEffect(() => {
    getConversations();
  }, [getConversations]);
  if (isConversationsLoading) return <SidebarSkeleton />;
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-3">
        <div className="flex items-center gap-2">
          <Users />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="pt-2">
          <SearchUser />
        </div>
      </div>
      <div className="overflow-y-auto w-full p-3 ">
        {conversations.map((chat) => {
          const user = chat.user;
          if (!user) return null;
          console.log("USER ID:", String(user._id));
          console.log("ONLINE USERS:", onlineUsers);

          const isOnline = onlineUsers.includes(String(user._id));

          return (
            <button
              key={chat.conversationId}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${SelectedUser?._id === user?._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user?.profilePic || avatar}
                  alt={user?.fullName}
                  className={`w-20 h-14 rounded-full p-[2px] ${SelectedUser?._id === user?._id ? "border-primary/40 border-[3px]" : ""}`}
                />
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3  bg-green-500 rounded-full border-2  border-whit "
                  />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0 w-full">
                <div className="flex justify-between ">
                  <div className="font-medium truncate">{user?.fullName}</div>
                  <div className="font-medium truncate">
                    {formatTime(chat.lastMessageTime)}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="text-sm text-zinc-400  overflow-hidden">
                    {chat.lastMessage}
                  </div>
                  {chat.unreadCount >0 && <div className="text-sm text-zinc-400 rounded-full bg-primary/20 w-5 text-primary/55 font-bold text-center">
                    {chat.unreadCount}
                  </div>

                  }
                  
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
