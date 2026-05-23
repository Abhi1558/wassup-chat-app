import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";



const PrivacySetting = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[calc(1oovh-5rem)] bg-base-200 flex justify-center items-center p-4">
      <div className="w-full max-w-3xl bg-primary-content rounded-3xl shadow-2xl border border-base-300 p-8 flex flex-col gap-6">
        {/* Heading */}
        <div className="mb-8 flex justify-between ">
          <div>
            <h1 className="text-3xl font-bold">{`Settings > Privacy Settings  `}</h1>
            <p className="text-sm opacity-70 mt-1">
            Manage your privacy settings
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

        {/* Last Seen */}
        <div className="bg-secondary-content rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition-all duration-300">
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-info-content">Last Seen</h2>
            <p className="text-sm text-base-content/60 mt-1">
              Turn your last seen status on or off in chats.
            </p>
          </div>

          <input
            type="checkbox"
            className="toggle toggle-success toggle-lg"
            defaultChecked
          />
        </div>

        {/* Online Status */}
        <div className="bg-secondary-content rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition-all duration-300">
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-info-content">Online Status</h2>
            <p className="text-sm text-base-content/60 mt-1">
              Hide your online activity and green indicator from others.
            </p>
          </div>

          <input
            type="checkbox"
            className="toggle toggle-success toggle-lg"
            defaultChecked
          />
        </div>

        {/* Blue Tick */}
        <div className="bg-secondary-content rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition-all duration-300">
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-info-content">Read Receipts</h2>
            <p className="text-sm text-base-content/60 mt-1">
              When disabled, nobody can see blue ticks on messages — including
              you.
            </p>
          </div>

          <input
            type="checkbox"
            className="toggle toggle-success toggle-lg"
            defaultChecked
          />
        </div>

        {/* Search Visibility */}
        <div className="bg-secondary-content rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition-all duration-300">
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-info-content">Find Me in Search</h2>
            <p className="text-sm text-base-content/60 mt-1">
              Prevent people from finding your account in search results.
            </p>
          </div>

          <input
            type="checkbox"
            className="toggle toggle-success toggle-lg"
            defaultChecked
          />
        </div>
      </div>
    </div>
  );
};
export default PrivacySetting
