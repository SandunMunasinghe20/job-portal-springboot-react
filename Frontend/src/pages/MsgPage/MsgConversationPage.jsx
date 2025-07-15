import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

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
      const res = await fetch(`http://localhost:8080/api/msg/inbox?userId=${currentId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        toast.error("Failed to load inbox");
        return;
      }

      const data = await res.json();
      setConversations(data);
    } catch (err) {
      toast.error("Error loading inbox");
    }
  }

  return (
    <>
      <NavBar role={role} />
      <div className="max-w-xl mx-auto mt-6 p-4 border rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">Messages</h2>

        {conversations.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          <ul>
            {conversations.map((msg) => {
              const chatUserId = msg.receiverId;
              const chatUserName = msg.senderName;
              const lastMessage = msg.content;
              const lastMessageTime = msg.sendTime;

              return (
                <li
                  key={msg.msgId}
                  /* move to single chat page */
                  onClick={() => navigate(`/msg?senderId=${currentId}&receiverId=${chatUserId}`)}

                  className="cursor-pointer p-3 border-b hover:bg-gray-100 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{chatUserName}</p>
                    <p className="text-sm text-gray-600 truncate max-w-xs">{lastMessage}</p>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <div>{new Date(lastMessageTime).toLocaleDateString()}</div>
                    {msg.unreadCount > 0 && (
                      
                      
                      <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                        {msg.unreadCount}
                      </span>

                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}