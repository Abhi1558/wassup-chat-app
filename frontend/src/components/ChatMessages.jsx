import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { socket } from "../lib/socket";

const ChatMessages = () => {
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Zustand selectors
  const messages = useChatStore(
    (state) => state.messages
  );

  const getMessages = useChatStore(
    (state) => state.getMessages
  );

  const SelectedUser = useChatStore(
    (state) => state.SelectedUser
  );

  const authUser = useAuthStore(
    (state) => state.authUser
  );

  // Fetch messages
  useEffect(() => {
    if (!SelectedUser?._id) return;

    getMessages();
  }, [SelectedUser?._id]);

  // Scroll
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 👁️ Mark seen
  useEffect(() => {
  if (!SelectedUser?._id || !authUser?._id) return;

  const hasUnread = messages.some(
    (msg) =>
      String(msg.senderId) === String(SelectedUser._id) &&
      msg.status !== "seen"
  );

  if (!hasUnread) return;

  socket.emit("markSeen", {
    senderId: SelectedUser._id,
    receiverId: authUser._id,
  });
}, [messages, SelectedUser?._id, authUser?._id]);
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(message);

    return groups;
  }, {});

  return (
    <div className="flex flex-col p-4 overflow-y-auto">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* DATE LABEL */}
          <div className="flex justify-center my-4">
            <div className="bg-base-300 text-sm px-4 py-1 rounded-full">
              {date}
            </div>
          </div>

          {/* MESSAGES */}
          {msgs.map((message) => {
            const isMyMessage =
  String(message.senderId) === String(authUser._id);

            return (
              <div
                key={message._id}
                className={`flex mb-3 ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                {/* MESSAGE BUBBLE */}
                <div
                  className={`
                      max-w-[75%]
                      rounded-2xl
                      px-3
                      py-2
                      break-words
                      ${
                        isMyMessage
                          ? "bg-primary/30 text-base-content"
                          : "bg-base-300"
                      }
                    `}
                >
                  {/* IMAGE */}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="message"
                      className="
                          rounded-xl
                          mb-2
                          w-40
                          h-40
                        "
                    />
                  )}

                  {/* TEXT */}
                  {message.text && <p className="text-sm">{message.text}</p>}

                  {/* TIME */}
                  <div
                    className="
                    text-[11px]
                    opacity-70
                    mt-1
                    flex
                    items-center
                    justify-end
                    gap-1
                  "
    
                  >
                    {/* TIME */}
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {/* TICKS ONLY FOR MY MESSAGES */}
                    {isMyMessage && (
                      <span>
                        {message.status === "sent" && (
                          <span className="text-gray-400">✓</span>
                        )}

                        {message.status === "delivered" && (
                          <span className="text-gray-400">✓✓</span>
                        )}

                        {message.status === "seen" && (
                          <span className="text-blue-500">✓✓</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
