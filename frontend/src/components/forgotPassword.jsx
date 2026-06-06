import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {useSettingStore} from "../store/useSetting.js";

const forgotPassword = () => {
  const { passwordChangeloading , forgotPassword } = useSettingStore();
  const [email, setEmail] = useState("");

 
  const navigate = useNavigate();
  const HandleForgotPassword = () => {
    forgotPassword({email});
    
  };
  return (
    <div className="w-full h-[calc(100vh-4rem)] mt-16 bg-base-200 flex justify-center items-center p-4">
      <div className="w-full h-full  max-w-2xl bg-base-100 rounded-3xl shadow-xl border border-base-300 p-6 flex flex-col gap-4">
        <div className="mb-8 flex justify-between ">
          <div>
            <h1 className="text-3xl font-bold">{`Settings > Forgot password  `}</h1>
            <p className="text-sm opacity-70 mt-1">
            Forgot your password
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
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        

        <button
          className="btn btn-md w-full hover:bg-primary/30 text-xl"
          onClick={HandleForgotPassword}
        >
          { passwordChangeloading ? "Updating..." : "Reset Password"  }
        </button>
       
          
       
      </div>
      
    </div>
  );
};

export default forgotPassword;
