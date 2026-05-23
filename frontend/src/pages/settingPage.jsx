import { useNavigate, Outlet, useLocation } from "react-router-dom";

import {
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  ScanEye,
  UserX,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const Setting = () => {
  const [wantDelete, setWantDelete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMainSettingsPage = location.pathname === "/settings";

  const { authUser, logout } = useAuthStore();

  const ChangeEmail = () => navigate("/settings/change-email");

  const ChangePassword = () => navigate("/settings/change-password");
  const privacySetting = () => navigate("/settings/privacy");
  const DeleteAccount = () => {};

  return (
    <div className="w-full  mt-16 bg-base-200 flex justify-center p-4 ">
      {isMainSettingsPage ? (
        <div className="w-full max-w-2xl bg-base-100 rounded-3xl shadow-xl border border-base-300 p-6 ">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>

            <p className="text-sm opacity-70 mt-1">
              Manage your account settings
            </p>
          </div>

          {/* PROFILE SECTION */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">Profile</h2>
            </div>

            <div
              onClick={() => navigate("/profile")}
              className="bg-base-200 hover:bg-base-300 transition-all cursor-pointer rounded-2xl p-4 flex items-center justify-between mb-3"
            >
              <div>
                <p className="font-medium">Profile Info</p>

                <p className="text-sm opacity-70">View and edit your profile</p>
              </div>

              <ChevronRight className="size-5 opacity-60" />
            </div>
            <div
              onClick={ChangeEmail}
              className="bg-base-200 hover:bg-base-300 transition-all cursor-pointer rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Mail className="size-5" />

                <div>
                  <p className="font-medium">Change Email</p>

                  <p className="text-sm opacity-70 break-all">
                    {authUser?.email}
                  </p>
                </div>
              </div>

              <ChevronRight className="size-5 opacity-60" />
            </div>
          </div>

          {/* PRIVACY SECTION */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="size-5 text-primary" />

              <h2 className="text-xl font-semibold">Privacy & Security</h2>
            </div>

            <div className="space-y-4">
              {/* Privacy */}

              <div
                onClick={privacySetting}
                className="bg-base-200 hover:bg-base-300 transition-all cursor-pointer rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <ScanEye className="size-5" />

                  <div>
                    <p className="font-medium">Privacy</p>

                    <p className="text-sm opacity-70">Manage Your Privacy</p>
                  </div>
                </div>

                <ChevronRight className="size-5 opacity-60" />
              </div>

              {/* PASSWORD */}
              <div
                onClick={ChangePassword}
                className="bg-base-200 hover:bg-base-300 transition-all cursor-pointer rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="size-5" />

                  <div>
                    <p className="font-medium">Change Password</p>

                    <p className="text-sm opacity-70">Update your password</p>
                  </div>
                </div>

                <ChevronRight className="size-5 opacity-60" />
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="mb-8">
            <h2 className="text-orange-700 font-semibold mb-4">Danger Zone</h2>

            <div
              onClick={() => setWantDelete(true)}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <UserX className="size-5 text-orange-700" />

                <div>
                  <p className="font-medium text-orange-700">Delete Account</p>

                  <p className="text-sm opacity-70">
                    Permanently remove your account
                  </p>
                </div>
              </div>

              <ChevronRight className="size-5 text-orange-700" />
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="btn btn-primary hover:bg-primary/30 hover:text-black hover:border-none w-full rounded-2xl "
          >
            <LogOut className="size-5" />
            Logout
          </button>
          {wantDelete && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
              <div className="w-full max-w-md bg-base-100 rounded-3xl shadow-2xl p-6 flex flex-col gap-5">
                {/* Heading */}
                <h1 className="text-2xl font-bold text-center">
                  Account Deletion Confirmation
                </h1>

                {/* Warning Text */}
                <p className="text-center text-warning font-medium">
                  Your account and all associated data will be permanently
                  removed. This action cannot be undone. Are you sure you want
                  to continue?
                </p>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-2">
                  {/* Cancel */}
                  <button
                    className="btn btn-ghost"
                    onClick={() => setWantDelete(false)}
                  >
                    Cancel
                  </button>

                  {/* Delete */}
                  <button className="btn btn-error" onClick={DeleteAccount}>Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Setting;
