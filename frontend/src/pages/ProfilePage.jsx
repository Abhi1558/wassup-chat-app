import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User, Info, ArrowLeft } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import avatar from "/avatar.jpg";

const Profile = () => {
  const { isCheckingAuth,authUser, isUpdating, updateProfile } = useAuthStore();
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const isOnline = onlineUsers.includes(String(authUser?._id));
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    description: authUser?.description || "",
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewPic, setPreviewPic] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
  if (!authUser) return;

  setFormData({
    fullName: authUser.fullName || "",
    description: authUser.description || "",
    });
  }, [authUser?.fullName, authUser?.description]);
  console.log({ authUser });
  console.log(formData);

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewPic(URL.createObjectURL(file));
    setProfilePicFile(file);
  };
  const handleName = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdate = () => {
    const formDataToSend = new FormData();

    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("description", formData.description);

    if (profilePicFile) {
      formDataToSend.append("profilePic", profilePicFile);
    }

    updateProfile(formDataToSend);
  };
  if (isCheckingAuth) {
  return (
    <div className="h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
  }
  return (
    <div className="h-screen pt-10">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-primary/10 rounded-xl p-4 space-y-4">
          <div className="relative flex justify-center items-center">
            {/* Center Content */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              disabled={isUpdating}
              className="btn btn-ghost gap-2 absolute right-0"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={previewPic || authUser?.profilePic || avatar}
                alt="profilePic"
                className="size-32 rounded-full p-1 object-cover border-4 border-primary/20"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer 
                  transition-all duration-200 ${isUpdating ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-100 " />
                <input
                  type="file"
                  id="avatar-upload"
                  disabled={isUpdating}
                  className="hidden"
                  onChange={handleProfilePic}
                />
              </label>
            </div>
            <div className="w-full bg-inherit">
              <div className="mx-2">
                <div className="form-control ">
                  <label className="label">
                    <div className="flex gap-3">
                      <User className="size-6 text-base-content/80 " />
                      <span className="label-text text-lg font-bold">
                        Full Name
                      </span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleName}
                    disabled={isUpdating}
                    className="input pl-10 input-bordered w-full text-lg h-9 "
                  />
                </div>
                <div className="form-control ">
                  <label className="label">
                    <div className="flex gap-3">
                      <Info className="size-6 text-base-content/80 " />
                      <span className="label-text text-lg font-bold">
                        About me
                      </span>
                    </div>
                  </label>
                  {!formData.description && !isEditingDescription && (
                    <button
                      onClick={() => setIsEditingDescription(true)}
                      className=" rounded-lg bg-base-100 w-full h-9 hover:bg-base-300"
                    >
                      Add Description
                    </button>
                  )}

                  {/* CASE 2: EDIT MODE → show textarea */}
                  {isEditingDescription && (
                    <>
                      <textarea
                        name="description"
                        value={formData.description}
                        disabled={isUpdating}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                        className="textarea textarea-bordered w-full h-20 text-lg"
                        placeholder="Write something about yourself..."
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setIsEditingDescription(false)}
                          className="btn btn-sm"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => setIsEditingDescription(false)}
                          className="btn bg-primary/30 btn-sm hover:bg-primary/50 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}

                  {formData.description && !isEditingDescription && (
                    <div className="p-3 bg-white rounded-lg text-lg h-auto flex flex-col">
                      <div className="max-h-20 w-full overflow-y-auto break-words">
                        {formData.description}
                      </div>

                      <button
                        onClick={() => setIsEditingDescription(true)}
                        className="text-sm text-primary/50 "
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                <div className=" mt-10  bg-base-200 rounded-xl p-2 mx-3 ">
                  <h2 className="text-lg font-medium mb-1">
                    Account Information
                  </h2>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                      <span>Member Since</span>
                      <span>{authUser.createdAt?.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-zinc-700">
                      <span>Status</span>

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />

                        <span
                          className={`font-bold ${
                            isOnline ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex form-control items-end mt-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    className="btn btn-sm w-20 h-9"
                    onClick={handleUpdate}
                  >
                    {isUpdating ? "Saving..." : "Done"}{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
