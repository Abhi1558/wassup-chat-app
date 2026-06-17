import React from "react";
import { useEffect } from "react";
import Navbar from "../src/components/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import Setting from "./pages/settingPage";
import VerifySignupPage from "./pages/verifysignup";
import VerifyNewEmail from "./pages/verifyNewEmail";
import VerifyAndForgotPassword from "./pages/verify&forgotPassword";
import SocketManager from "./components/socketManager";
import ChangeEmail from "./components/ChangeEmail";
import PrivacySetting from "./components/PrivacySetting";
import ChangePassword from "./components/ChangePassword";
import ForgotPassword from "./components/forgotPassword";
import DeleteAccount from "./components/deleteAccount";
import { useThemeStore } from "./store/useThemeStore";
import SelectedUserProfile from "./components/SelectedUserProfile";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <SocketManager />
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/Login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/Login" />}
        />
        <Route
          path="/settings"
          element={authUser ? <Setting /> : <Navigate to="/Login" />}
        >
          <Route index element={<Navigate to="change-email" />} />

          <Route path="change-email" element={<ChangeEmail />} />

          <Route path="privacy" element={<PrivacySetting />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="delete-account" element={<DeleteAccount />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/verification/signUp-verification/:token"
          element={<VerifySignupPage />}
        />
        <Route
          path="/verification/email-verification/:token"
          element={<VerifyNewEmail />}
        />
        <Route
          path="/verification/password-verification/:token"
          element={<VerifyAndForgotPassword />}
        />
      <Route
        path="/user-profile"
        element={authUser ? <SelectedUserProfile /> : <Navigate to="/login" />}
      />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
