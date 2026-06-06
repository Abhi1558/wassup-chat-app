import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useSettingStore } from "../store/useSetting.js";

const DeleteAccountPage = () => {
  const [password, setPassword] = useState("");

  const { deleteAccount, isDeletingAccount } = useSettingStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await deleteAccount(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 shadow-xl p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="size-14 rounded-full bg-error/10 flex items-center justify-center">
            <AlertTriangle className="size-7 text-error" />
          </div>

          <h1 className="text-2xl font-bold">Delete Account</h1>

          <p className="text-base-content/70 text-sm">
            This action is permanent and cannot be undone.
            All your chats, messages, and account data will be deleted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">
              <span className="label-text">
                Confirm your password
              </span>
            </label>

            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="rounded-lg bg-error/10 border border-error/20 p-3">
            <p className="text-sm text-error">
              Fill your password to confirm deletion.
            </p>
          </div>

          <button
            type="submit"
            disabled={isDeletingAccount}
            className="btn btn-error w-full"
          >
            {isDeletingAccount ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete My Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountPage;