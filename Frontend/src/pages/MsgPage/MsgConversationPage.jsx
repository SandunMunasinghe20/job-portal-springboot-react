import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";
import React from "react";


export default function MsgInboxPage() {
  const [conversations, setConversations] = useState([]);
  const token = localStorage.getItem("auth-token");
  const currentId = Number(localStorage.getItem("id"));
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  //const searchParams = useSearchParams();
  //const receiverId = searchParams.get("receiverId");

  useEffect(() => {
    fetchInbox();
  }, []);

  async function fetchInbox() {
    try {
      const res = await fetch(
        `http://localhost:8080/api/msg/inbox?userId=${currentId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      if (!res.ok) {
        const data = await res.text();
        toast.error(data);
        return;
      }

      const data = await res.json();
      console.log("data: ", data);
      setConversations(data);
    } catch (err) {
      toast.error(`Error loading inbox || ${err}`);
    }
  }

  return (
    <>
      <NavBar role={role} />
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="max-w-4xl px-4 mx-auto">
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
              <h1 className="text-2xl font-bold text-white">Messages</h1>
            </div>

            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-500">
                  No messages yet.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Start a conversation to see your messages here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations
                  .filter(
                    (msg) =>
                      !(
                        msg.senderId === currentId &&
                        msg.receiverId === currentId
                      ),
                  )
                  .map((msg) => {
                    const chatUserId =
                      msg.senderId === currentId
                        ? msg.receiverId
                        : msg.senderId;
                    const chatUserName =
                      msg.senderId === currentId
                        ? msg.senderName
                        : msg.receiverName;

                    const lastMessage = msg.content;
                    const lastMessageTime = msg.sendTime;

                    return (
                      <div
                        key={msg.id}
                        onClick={() =>
                          navigate(
                            `/msg?senderId=${currentId}&receiverId=${chatUserId}`,
                          )
                        }
                        className="flex items-center justify-between p-4 transition-colors duration-200 cursor-pointer hover:bg-blue-50 group"
                      >
                        <div className="flex items-center flex-1 min-w-0 space-x-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                              <span className="text-lg font-semibold text-white">
                                {chatUserName?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                              {chatUserName}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 truncate">
                              {lastMessage}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end flex-shrink-0 space-y-2">
                          <span className="text-xs font-medium text-gray-500">
                            {new Date(lastMessageTime).toLocaleDateString()}
                          </span>
                          {msg.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5 animate-pulse">
                              {msg.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
