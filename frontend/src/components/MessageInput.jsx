import React from "react";
import { Send, Image, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const { sendMessages, isMessagesLoading } = useChatStore();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState("");
  const ImageRef = useRef();
  const SendRef = useRef();
  const { SelectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const isBlocked = authUser?.blockedUser?.some(
    (id) => id.toString() === SelectedUser?._id
  );
  const handleSend = () => {
    const data = new FormData();

    if (imageFile) {
      data.append("image", imageFile);
    }

    if (text) {
      data.append("text", text);
    }

    sendMessages(data);
    setText("");
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div>
      {isBlocked ? (
        <div className="p-4 border-t border-base-300 text-center">
          <p className="text-error font-medium">
            You have blocked this user. Unblock them to send messages.
          </p>
        </div>
      ) : (
        <div>
          <div>
            {imagePreview && (
              <div className="p-3 flex items-center gap-2">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                  />
                  <button
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full p-2">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-primary input-md w-full flex-3"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex items-center flex-1">
              <input
                type="file"
                className="hidden"
                ref={ImageRef}
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => ImageRef.current?.click()}
                disabled={isMessagesLoading}
              >
                <Image className="size-7" />
              </button>
            </div>

            <div className="flex items-center flex-1">
              <button
                type="button"
                onClick={handleSend}
                disabled={isMessagesLoading}
              >
                <Send className="size-7" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
