import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useRef } from "react";

const VerifyEmailPage = () => {
  const hasVerified = useRef(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
  if (hasVerified.current) return;

  hasVerified.current = true;

  const verifyEmail = async () => {
    try {
      const res = await axiosInstance.get(
        `/verification/signUp-verification/${token}`
      );

      toast.success(res.data.message);

      await checkAuth();

      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Verification failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (token) verifyEmail();
}, [token]);

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-10 animate-spin" />
          <p>Verifying your email...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">
            Verification Failed
          </h2>
          <p className="mt-2 text-gray-500">{error}</p>

          <button
            onClick={() => navigate("/signup")}
            className="btn btn-primary mt-4"
          >
            Go to Signup
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-green-500">
            Verification Successful
          </h2>
          <p className="mt-2 text-gray-500">{error}</p>

          <button
            onClick={() => navigate("/")}
            className="btn btn-primary mt-4"
          >
            Click here to continue
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
