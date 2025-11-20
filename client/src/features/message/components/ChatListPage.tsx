import { ChevronLeft, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext";
import { useEffect, useState } from "react";
import { getConversations } from "../../../lib/axios/chatInstance";
import { toast } from "react-toastify";

const ChatListPage = () => {
  const navigate = useNavigate();

  const { socket } = useSocket();
  const [conversations, setConversations] = useState<any[]>([]);
  console.log(conversations);

  const [activeTab, setActiveTab] = useState("all");

  // Load conversations on mount
  useEffect(() => {
    getConversations()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        if (data.length > 0) {
          setConversations(data);
          toast.dismiss();
        } else {
          console.error("Expected array but got:", res);
          setConversations([]);
          toast.error("Invalid data received from server.");
        }
      })
      .catch((err) => {
        console.error("Error fetching conversations", err);
        toast.error("Failed to load conversations.");
        setConversations([]);
      });
  }, []);
  // socket listener
  useEffect(() => {
    if (!socket) return;
    socket.on("welcome", (msg: string) => {
      console.log("Server:", msg);
    });
    return () => {
      socket.off("welcome");
    };
  }, [socket]);

  // filter chats by tab
  const filteredChats = Array.isArray(conversations)
    ? conversations.filter((chat) => {
        if (activeTab === "firms") return chat.type === "firm";
        if (activeTab === "unread") return chat.unreadCount > 0;
        return true; // all
      })
    : [];

  // total unread for tab title
  const totalUnread = Array.isArray(conversations)
    ? conversations.reduce((acc, c) => acc + c.unreadCount, 0)
    : 0;

  return (
    <>
      <div className="flex justify-center bg-white  min-h-screen">
        <div className="w-full max-w-lg bg-white shadow-md min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center h-20 justify-between m-4 bg-gray-100 px-4 py-3 shadow">
            <button onClick={() => window.history.back()}>
              {" "}
              <ChevronLeft size={22} />
            </button>

            <h1 className="font-semibold flex items-center text-lg">
              <div className="bg-blue-600 h-8 w-8 rounded-full flex items-center justify-center me-2">
                <MessageCircle size={19} className="text-white" />
              </div>
              Chat Box
            </h1>
            <button className="text-gray-700">
              <Search size={22} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-around px-2 py-3 mb-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-xl text-lg ${
                activeTab == "all"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-black"
              }`}
            >
              All Chat
            </button>

            <button
              onClick={() => setActiveTab("firms")}
              className={`px-5 py-2 rounded-xl text-lg ${
                activeTab == "firms"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-black"
              }`}
            >
              Firms
            </button>

            <button
              onClick={() => setActiveTab("unread")}
              className={`px-5 py-2 rounded-xl text-lg ${
                activeTab == "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-black"
              }`}
            >
              Unread {totalUnread > 0 && `(${totalUnread})`}
            </button>
          </div>

          {/* Chat List */}

          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              className="flex items-center p-3 mb-4 mx-6  bg-gray-100 h-20 shadow rounded-lg cursor-pointer"
              onClick={() =>
                navigate(`/chatdetail/${chat._id}`, {
                  state: { name: chat.name || "unknown", img: chat.img || "" },
                })
              }
            >
              {chat.img ? (
                <img
                  src={chat.img}
                  alt={chat.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <img
                  src="https://thefetus.net/images/web/profile-default.png?v=2"
                  alt=""
                  className="w-14 h-14 rounded-full mr-3"
                />
              )}

              <div className="flex-1 ms-2">
                <h3 className="font-semibold">{chat.name}</h3>
              </div>

              <span className="text-sm mr-4 text-gray-400">
                {new Date(chat.createdAt).toLocaleDateString()}
              </span>
              {chat.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default ChatListPage;
