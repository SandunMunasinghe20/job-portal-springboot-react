import React from "react";

import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";
import { MdDone, MdDoneAll, MdSend } from "react-icons/md";
import { FiUser, FiMessageCircle } from "react-icons/fi";

export default function MsgPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("receiverId");
  const senderId = searchParams.get("senderId");

  console.log("receiver id is ", receiverId);
  console.log("sender id is ", senderId);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("auth-token");
  const currentId = Number(localStorage.getItem("id"));

  const handleSend = async () => {
    if (!msg.trim()) {
      toast.error("Please Enter a message.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/msg/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          senderId: Number(currentId),
          receiverId: Number(receiverId),
          content: msg,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        toast.error(err);
        return;
      }
      toast.success("Message Sent");
      setMsg("");
      await getChat();
    } catch (e) {
      toast.error(`Unable to connect with the Server.Try again. || ${e}`);
    }
  };

  const handleMarkAsRead = async (msg) => {
    try {
      const response = await fetch(
        `${API_URL}/msg/mark-as-read`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            msgId: msg.msgId,
            senderId: msg.senderId,
            receiverId: currentId,
          }),
        },
      );

      const data = await response.text();

      if (!response.ok) {
        console.log(data);
        return;
      }

      console.log("msgs marked as read");
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const getChat = async () => {
    try {
      const response = await fetch(
        `${API_URL}/msg/chat?senderId=${currentId}&receiverId=${receiverId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      if (!response.ok) {
      const err = await (response.json() || response.text());
       if(err != "Your Inbox is empty"){
        toast.error(err);
      }
        return;
      }

      const data = await response.json();
      setChat(data);
      console.log("chat data : ", data);
      toast.success("Chat loaded successfully");

      const unreadMsgs = data.filter(
        (msg) => msg.receiverId === currentId && msg.status !== "READ",
      );

      if (unreadMsgs.length > 0) {
        await Promise.all(
          unreadMsgs.map((msg) =>
            handleMarkAsRead(msg).catch((err) => console.error(err)),
          ),
        );

        // Update local chat state to mark messages as read
        setChat((prevChat) =>
          prevChat.map((m) =>
            unreadMsgs.find((u) => u.msgId === m.msgId)
              ? { ...m, status: "read" }
              : m,
          ),
        );
      }
    } catch (error) {
      toast.error(`Unable to load Chat || ${error}`);
      return;
    }
  };

  useEffect(() => {
    getChat();
    const interval = setInterval(() => {
      // getChat();
    }, 30000); // refresh chat every 30 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [receiverId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatPartnerName =
    chat.length > 0
      ? chat[0].senderId === currentId
        ? chat[0].receiverName
        : chat[0].senderName
      : "Loading...";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role={role} />

      {/* Chat Header */}
      <div className="bg-white border-b shadow-md">
        <div className="max-w-4xl px-6 py-6 mx-auto">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-50">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {chatPartnerName}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FiMessageCircle className="w-4 h-4" />
                <span>{chat.length} messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl px-6 py-8 mx-auto">
        <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
          {/* Messages Area */}
          <div className="p-6 overflow-y-auto border-b h-96 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-4">
              {chat.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FiMessageCircle className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                chat.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      message.senderId == currentId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md
                    ${
                      message.senderId == currentId
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                    }`}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {message.content}
                      </p>
                    </div>

                    {/* Message metadata */}
                    <div className="flex items-center gap-2 px-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(message.sendTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {/* Show status only if current user sent the message */}
                      {message.senderId === currentId && (
                        <div className="flex items-center">
                          {message.status === "SENT" && (
                            <MdDone size={14} className="text-gray-400" />
                          )}
                          {message.status === "DELIVERED" && (
                            <MdDoneAll size={14} className="text-gray-400" />
                          )}
                          {message.status === "READ" && (
                            <MdDoneAll size={14} className="text-blue-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Input Area */}
          <div className="p-6 bg-white">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 text-gray-800 placeholder-gray-500 border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="Type your message..."
                  rows="2"
                />
              </div>
              <button
                onClick={handleSend}
                className="p-3 text-white transition-colors duration-200 bg-blue-600 shadow-md rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-lg"
                disabled={!msg.trim()}
              >
                <MdSend size={20} />
              </button>
            </div>

            {/* Input Helper Text */}
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-xs text-gray-400">
                Press Enter to send, Shift + Enter for new line
              </span>
              <span className="text-xs text-gray-400">{msg.length}/500</span>
            </div>
          </div>
        </div>

        {/* Chat Actions */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-sm text-gray-600 transition-colors duration-200 hover:text-blue-600">
              Clear Chat
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 transition-colors duration-200 hover:text-blue-600">
              Block User
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 transition-colors duration-200 hover:text-blue-600">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
