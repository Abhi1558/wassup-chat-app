import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { axiosInstance } from "../lib/axios";
import avatar from "../../public/avatar.jpg";

function SearchUser() {
  const [search, setSearch] = useState("");
  const { searchedUsers, searchUsers, isSearching, clearUsers, SelectedUser, setSelectedUser } = useChatStore();
  const boxRef = useRef();

 
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchUsers(search);
      } else {
        clearUsers();
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search, searchUsers, clearUsers]);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setSearch("");
        clearUsers();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      
      {/* 🔍 Input */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input input-bordered input-sm w-full max-w-xs"
      />

      {/* 📋 Dropdown */}
      {search && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full left-0 w-full bg-base-300 border rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-50"
        >
          {isSearching ? (
            <div className="p-3 text-primary/20">Searching...</div>
          ) : searchedUsers.length > 0 ? (
            searchedUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer"
              >
                <img
                  src={user.profilePic || "/avatar.jpg"}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.fullName}</span>
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchUser;
