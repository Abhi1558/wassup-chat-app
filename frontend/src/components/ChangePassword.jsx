import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const changePassword = () => {
  const navigate = useNavigate();
  const HandleChangePassword = () => {
    setTimeout();
  };
  return (
    <div className="w-full h-[calc(100vh-5rem)]  bg-base-200 flex justify-center items-center p-4">
      <div className="w-full h-full  max-w-2xl bg-base-100 rounded-3xl shadow-xl border border-base-300 p-6 flex flex-col gap-4">
        <div className="mb-8 flex justify-between ">
          <div>
            <h1 className="text-3xl font-bold">{`Settings > Change password  `}</h1>
            <p className="text-sm opacity-70 mt-1">
            Change your password
          </p>
          </div>
          <div>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-ghost gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>
          

          
        </div>
        <div className="border border-base-300 rounded-xl px-4 py-3">
          <input
            type="text"
            className="w-full bg-transparent outline-none text-xl"
            placeholder="Enter old Email"
          />
        </div>

        <div className="border border-base-300 rounded-xl px-4 py-3">
          <input
            type="text"
            className="w-full bg-transparent outline-none text-xl"
            placeholder="Enter new Email"
          />
        </div>

        <button
          className="btn btn-md w-full hover:bg-primary/30 text-xl"
          onClick={HandleChangePassword}
        >
          Change Email
        </button>
      </div>
    </div>
  );
};

export default changePassword;
