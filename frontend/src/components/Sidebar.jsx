import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users, Menu, X, Search, PanelLeft } from "lucide-react";
import SidebarSkeleton from "./skeleton/SidebarSkeleton.jsx";
import SearchUser from "./searchUsers.jsx";
import avatar from "../../public/avatar.jpg";

const Sidebar = () => {
  const {
    isConversationsLoading,
    SelectedUser,
    setSelectedUser,
    getConversations,
    isSidebarOpen,
    setSidebarOpen,
  } = useChatStore();

  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const conversations = useChatStore((state) => state.conversations);

  useEffect(() => {
    getConversations(true);
  }, [getConversations]);
  useEffect(() => {
    getConversations(false);
  }, [onlineUsers]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isConversationsLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MOBILE EXPANDED */}
      <aside
        className={`
          bg-base-100 border-r border-base-300 flex flex-col transition-all duration-300

          lg:relative lg:z-auto lg:w-72 lg:h-full

          ${
            isSidebarOpen
              ? `absolute top-16 left-0 bottom-0 z-50 w-[90%] max-w-sm p-4 m-4 rounded-2xl transform translate-transform   ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full scroll-y-auto"
                }ease-in-out duration-700`
              : "w-20 h-full"
          }
        `}
      >
        {/* HEADER */}
        <div className="border-b border-base-300 p-3">
          {/* DESKTOP HEADER - UNCHANGED */}
          <div className="hidden lg:flex items-center gap-2">
            <Users />
            <span className="font-medium">Contacts</span>
          </div>

          {/* MOBILE COLLAPSED */}
          {!isSidebarOpen && (
            <div className="lg:hidden flex flex-col items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="btn btn-ghost btn-circle"
              >
                <PanelLeft size={22} />
              </button>

              <button
                onClick={() => setSidebarOpen(true)}
                className="btn btn-ghost btn-circle"
              >
                <Search size={20} />
              </button>
            </div>
          )}

          {/* MOBILE EXPANDED */}
          {isSidebarOpen && (
            <div className="lg:hidden  ">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users />
                  <span className="font-medium text-lg">Contacts</span>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="btn btn-ghost btn-circle"
                >
                  <X />
                </button>
              </div>

              <SearchUser />
            </div>
          )}

          {/* DESKTOP SEARCH - UNCHANGED */}
          <div className="hidden lg:block pt-2">
            <SearchUser />
          </div>
        </div>

        {/* USERS */}
        <div className="overflow-y-auto w-full p-3">
          {conversations.map((chat) => {
            const user = chat.user;
            if (!user) return null;

            const isOnline = onlineUsers.includes(String(user._id));

            return (
              <button
                key={chat.conversationId}
                onClick={() => {
                  setSelectedUser(user);

                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`
                  w-full lg:p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors rounded-lg
                  ${
                    SelectedUser?._id === user?._id
                      ? "bg-base-300 ring-1 ring-base-300"
                      : ""
                  }
                `}
              >
                {/* AVATAR */}
                <div
                  className={`
                    w-20 relative m-2
                    ${isSidebarOpen ? "" : "mx-auto  lg:mx-0"}
                  `}
                >
                  <img
                    src={user?.profilePic || "/avatar.jpg"}
                    alt={user?.fullName}
                    className={`
                      avatar
                      size-12 rounded-full
                      ${
                        SelectedUser?._id === user?._id
                          ? "border-primary/40 border-[3px]"
                          : ""
                      }
                    `}
                  />

                  {/* ONLINE DOT */}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100" />
                  )}

                  {/* MOBILE COLLAPSED UNREAD BADGE */}
                  {!isSidebarOpen && chat.unreadCount > 0 && (
                    <span
                      className="
                          absolute
                          -top-1
                          -right-1
                          min-w-5
                          h-5
                          rounded-full
                          bg-primary
                          text-primary-content
                          text-xs
                          flex
                          items-center
                          justify-center
                          font-bold
                        "
                    >
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                {/* DESKTOP + MOBILE EXPANDED DETAILS */}
                <div
                  className={`
                    text-left min-w-0 w-full
                    ${isSidebarOpen ? "block" : "hidden lg:block"}
                  `}
                >
                  <div className="flex justify-between">
                    <div className="font-medium truncate">{user?.fullName}</div>

                    <div className="text-sm">
                      {formatTime(chat.lastMessageTime)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-zinc-400 truncate max-w-[180px]">
                      {chat.lastMessage}
                    </div>

                    {chat.unreadCount > 0 && (
                      <div
                        className="
                          text-xs
                          rounded-full
                          bg-primary/20
                          min-w-5
                          h-5
                          flex
                          items-center
                          justify-center
                          text-primary
                          font-bold
                        "
                      >
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
