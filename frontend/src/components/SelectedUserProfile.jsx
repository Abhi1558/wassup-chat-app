import React from "react";
import { Circle } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SelectedUserProfile = ({ user }) => {
    const navigate= useNavigate()
  const { SelectedUser, onlineUsers } = useChatStore();
  const isOnline = onlineUsers.includes(SelectedUser?._id);
  if (!SelectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a user to view profile
      </div>
    );
  }
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
    <div className=" mx-2 mt-16">
      <div className="flex justify-center items-center flex-col w-full">
        <div className="flex justify-end w-full">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-neutral btn-sm gap-2 mb-4 mt-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        <div className="w-full p-4 max-w-md mx-auto bg-base-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Cover */}
          <div className="relative h-28 bg-gradient-to-r rounded-t-2xl from-primary to-secondary">
            {/* Profile Picture */}
            <div className="absolute left-1/2 -bottom-14 -translate-x-1/2">
              <img
                src={SelectedUser.profilePic || "./avatar.jpg"}
                alt={SelectedUser.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-base-200"
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-16">
            {/* Name */}
            <div className="text-center">
              <h2 className="text-2xl font-bold">{SelectedUser.fullName}</h2>

              {isOnline && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Circle size={10} fill="#22c55e" className="border-none" />
                  <span className="text-sm text-base-content/70">Online</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {SelectedUser.description || "No description available."}
              </p>
            </div>

            {/* Extra Info */}
            <div className="mt-6 border-t border-base-300 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Email</span>
                <span>{SelectedUser.email || "N/A"}</span>
              </div>

              {!isOnline && SelectedUser.lastSeen && (
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-base-content/60">Last Seen</span>
                  <span>{getLastSeen(SelectedUser?.lastSeen)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedUserProfile;
