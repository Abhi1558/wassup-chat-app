import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Settings, User, LogOut } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Theme from "./theme";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Wassup!</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">

            {authUser? (
              <>
                <Theme/>
                <Link to={"/settings"} className="btn btn-sm transition-colors">
                  <Settings className="w-4 h-4 " />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                <Link to={"/profile"} className={"btn btn-sm gap-2"}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                
                <button onClick={logout} className="flex gap-2 items-center btn btn-sm">
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </>
            ):<Theme/>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
