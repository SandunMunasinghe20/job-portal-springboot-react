import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";
import { MdDone, MdDoneAll } from "react-icons/md";

export default function MsgPage() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
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
      const response = await fetch("http://localhost:8080/api/msg/send", {
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
      toast.error("Unable to connect with the Server.Try again.");
    }
  };

  const handleMarkAsRead = async (msg) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/msg/mark-as-read",
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
        }
      );

      const data = await response.text();

      if (!response.ok) {
        console.log(data);
        return;
      }

      console.log("msgs marked as read");
    } catch (e) {
      console.log("");
      return;
    }
  };

  const getChat = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/msg/chat?senderId=${currentId}&receiverId=${receiverId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        const err = await (response.json() || response.text());
        toast.error(err);
        return;
      }

      const data = await response.json();
      setChat(data);
      console.log("chat data : ", data);
      toast.success("Chat loaded successfully");

      const unreadMsgs = data.filter(
        (msg) => msg.receiverId === currentId && msg.status !== "READ"
      );

      if (unreadMsgs.length > 0) {
        await Promise.all(
          unreadMsgs.map((msg) =>
            handleMarkAsRead(msg).catch((err) => console.error(err))
          )
        );

        // Update local chat state to mark messages as read
        setChat((prevChat) =>
          prevChat.map((m) =>
            unreadMsgs.find((u) => u.msgId === m.msgId)
              ? { ...m, status: "READ" }
              : m
          )
        );
      }
    } catch (error) {
      toast.error("Unable to load Chat");
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

  return (
    <>
      <NavBar role={role} />
      <div className="text-center text-4xl text-blue-600 p-4">
        <h3>
          {chat.length > 0
            ? chat[0].senderId === currentId
              ? chat[0].receiverName
              : chat[0].senderName
            : "Loading..."}
        </h3>
      </div>

      <div className="max-w-xl mx-auto mt-6 p-4 border rounded-lg shadow">
        <div className="h-64 overflow-y-auto border-b mb-4 p-2">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.senderId == currentId ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl shadow 
            ${
              msg.senderId == senderId
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>

              {/*msg send time with status in ticks*/}
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span>
                  {new Date(msg.sendTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* Show status only if current user sent the message */}
                {msg.senderId === currentId && (
                  <>
                    {msg.status === "SENT" && <MdDone size={16} />}
                    {msg.status === "DELIVERED" && <MdDoneAll size={16} />}
                    {msg.status === "READ" && (
                      <MdDoneAll size={16} className="text-blue-500" />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
