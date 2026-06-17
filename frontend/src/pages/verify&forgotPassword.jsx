import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const VerifyAndForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.put(
        `/verification/password-verification/${token}`,
        {
          newPassword,
          confirmPassword,
        }
      );

      toast.success(res.data.message);

      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="bg-base-100 w-full max-w-md rounded-xl shadow-xl p-6">

        <h1 className="text-2xl font-bold mb-2">
          Reset Password
        </h1>

        <p className="opacity-70 mb-6">
          Enter your new password
        </p>

        <div className="space-y-4">

          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="New Password"
            disabled={loading}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Confirm Password"
            disabled={loading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={handleResetPassword}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAndForgotPassword;
