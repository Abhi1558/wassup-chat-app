import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingStore } from "../store/useSetting";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const navigate =useNavigate()
  const { SelectedUser, setSelectedUser, onlineUsers } = useChatStore();
  const { authUser } = useAuthStore();
  const { toggleBlockUser, isBlockingUser } = useSettingStore();

  const isBlocked = authUser?.blockedUser?.some(
    (id) => id.toString() === SelectedUser?._id
  );

  const isOnline = onlineUsers.includes(SelectedUser?._id);

  // function for last seen
  const getLastSeen = (lastSeen) => {
    if (!lastSeen) return "Offline";

    const now = new Date();
    const seenTime = new Date(lastSeen);

    const diffMs = now - seenTime;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // recently seen
    if (seconds < 60) {
      return "Recently seen";
    }

    // minutes ago
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    // hours ago
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    // days ago
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* avatar */}
          <button className="avatar"
          onClick={()=>navigate("/user-profile")}>
            <div className="size-10 rounded-full">
              <img src={SelectedUser?.profilePic || "../avatar.jpg"} alt="" />
            </div>
          </button>

          {/* info */}
          <div>
            <h3 className="font-medium">{SelectedUser?.fullName}</h3>

            <p className="text-sm text-base-content/70">
              {isOnline ? "Online" : getLastSeen(SelectedUser?.lastSeen)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleBlockUser(SelectedUser._id)}
            disabled={isBlockingUser}
            className="btn btn-xs btn-error"
          >
            {isBlockingUser ? "..." : isBlocked ? "Unblock" : "Block"}
          </button>

          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
