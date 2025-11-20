import { ChevronLeft, MoreVerticalIcon, PlusIcon, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/socketContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AttachmentMenu from "./AttachmentMenu";
import ProfileOption from "./ProfileOption";
import { toast } from "react-toastify";
import { getMessages, uploadAudio, uploadImage, uploadPdf } from "../../../lib/axios/chatInstance";
import type { Message } from "../../../lib/types/chatType";



const ChatDetailPage = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const location = useLocation()
  const { name, img } = location.state || { name: "Unknown", img: "" };
  const { socket } = useSocket()
  const myId = localStorage.getItem("userId");
  const navigate = useNavigate()

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAttachment, setShowAttachment] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);


  const bottomRef = useRef<HTMLDivElement | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const addMessage = (msg: Message) => {

    setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);

  };
  // fetch previous message
  useEffect(() => {
    if (!conversationId || !myId) return;
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(conversationId);
        const formatted = data.map((msg: any):Message => ({

          id: msg._id,
          text: msg.content,
          url: msg.mediaUrl || msg.url || null,
          type: msg.type,
          sender: String(msg.sender?._id) === String(myId) ? "me" : "other", fileName: msg.fileName,
          location: msg.location || null,
          createdAt: new Date(msg.createdAt).getTime(),
        }));
        setMessages(formatted.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0)));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching messages", err);
        toast.error("Failed to load messages");
      }
    };
    fetchMessages();
  }, [conversationId, myId]);

  // socket listener
  useEffect(() => {
    if (!socket || !conversationId || !myId) return;
    socket.emit("joinRoom", conversationId);
    const handleReceiveMessage = (msg: any) => {

      const senderId = msg.sender?._id || msg.sender;
      setMessages(prev => {
        if (prev.some(m => m.id === msg._id)) return prev;
        return [
          ...prev,
          {
            id: msg._id,
            text: msg.content,
            url: msg.mediaUrl,
            type: msg.type,
            sender: String(senderId) === String(myId) ? "me" : "other",
            fileName: msg.fileName,
            createdAt: new Date(msg.createdAt).getTime(),
            location: msg.location || null,
          },
        ];
      });
    };
    socket.on("receiveMessage", handleReceiveMessage);

    return () => { socket.off("receiveMessage", handleReceiveMessage); }

  }, [socket, conversationId, myId]);

  const handlesendMessage = async () => {

    if (!input.trim() || !conversationId || !myId || isBlocked) {
      if (!myId) {
        toast.error("User ID not found. Please log in.");
      }
      if (isBlocked) {
        toast.error("You cannot send messages to a blocked user.");
      }
      return;
    }

    const textToSend = input.trim();
    const tempId = `temp-${Date.now()}`;

    const newMsg: Message = {
      id: tempId,
      text: textToSend,
      type: "text",
      sender: "me",

    };
    addMessage(newMsg)

    setInput("");

    socket?.emit("sendMessage", {
      conversationId,
      type: "text",
      content: textToSend,
    }, (response: any) => {

      if (response.success) {
        setMessages((prev) =>
          prev.map(msg =>
            msg.id === tempId ? {

              ...msg, id: response.message._id, createdAt: new Date(response.message.createdAt).getTime(),

            } : msg))
      } else {
        toast.error("failed to send message")
        setMessages((prev) => prev.filter(msg => msg.id !== tempId))
      }
    })
  };


  const handleFileUpload = async (
    file: File,
    type: "image" | "document" | "audio" | "camera"
  ) => {
    if (!conversationId || !myId) return;

    const tempId = `temp-${Date.now()}`;
    const previewUrl = URL.createObjectURL(file);

    addMessage({
      id: tempId,
      type,
      url: previewUrl,
      sender: "me",
      fileName: type === "document" || type === "audio" ? file.name : undefined,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      let uploadResponse:any;
      if (type === "image" || type === "camera") {
        uploadResponse = await uploadImage(formData);
      } else if (type === "document") {
        uploadResponse = await uploadPdf(formData);
      } else if (type === "audio") {
        uploadResponse = await uploadAudio(formData);
      } else {
        throw new Error("Unsupported file type");
      }

      const { mediaUrl } = uploadResponse.data;

      socket?.emit(
        "sendMessage",
        {
          conversationId,
          type,
          mediaUrl,
          fileName: file.name,
        },
        (response: any) => {
          if (response.success) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempId
                  ? {
                    ...m,
                    id: response.message._id,
                    url: response.message.mediaUrl,
                    text: response.message.content,
                    createdAt: new Date(response.message.createdAt).getTime(),
                  }
                  : m
              )
            );
          } else {
            toast.error("Failed to send file");
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
          }
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // profile option 
  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${conversationId}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${name}'s Profile`,
          text: `Check out ${name}'s profile on our app!`,
          url: profileUrl,
        })
        .then(() => {
          toast.success("Profile link shared!");
        })
        .catch((err) => {
          console.error("Share failed:", err);
          toast.error("Failed to share profile");
        });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.info("Profile link copied to clipboard!");
    }
  };

  const handleReport = () => {
    toast.info("Profile reported!");
  };

  const handleClearChat = () => {
    if (!conversationId || !socket) return;

    socket.emit("clearChat", conversationId, (response: any) => {
      if (response.success) {
        setMessages([]);
        toast.success("Chat cleared successfully!");
      } else {
        toast.error(response.error || "Failed to clear chat");
      }
    });
  };


  const handleAboutProfile = () => {
    navigate('/profile')
  };
  const [isBlocked, setIsBlocked] = useState(false);

  const handleBlock = () => {
    setIsBlocked((prev) => !prev);
    toast.warning(isBlocked ? "User unblocked!" : "User blocked!");
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    if (!conversationId || !myId) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg: Message = {
      id: tempId,
      type: "location",
      sender: "me",
      location,
    };

    addMessage(newMsg);

    socket?.emit(
      "sendMessage",
      {
        conversationId,
        type: "location",
        location,
      },
      (response: any) => {
        if (response.success) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, id: response.message._id } : m
            )
          );
        } else {
          toast.error("Failed to send location");
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
        }
      }
    );
  };

  return (
    <div className="flex justify-center bg-white  min-h-screen">
      <div className="w-full max-w-xl bg-white shadow-md min-h-screen flex flex-col">

        {/* <ChatHeader /> */}
        <div className="flex items-center justify-between p-4 bg-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <button onClick={() => window.history.back()}> <ChevronLeft size={22} /></button>
              {img ? (
                <img src={img} alt={name} className="w-8 h-8 rounded-full" />
              ) : (<img src="https://thefetus.net/images/web/profile-default.png?v=2" alt="" className="w-14 h-14 rounded-full mr-3" />
              )}
              <p className="font-medium">{name}</p>
            </div>
          </div>

          <div ref={dropdownRef}><button onClick={() => setShowProfileOptions((prev) => !prev)}> <MoreVerticalIcon size={22} /> </button>
            {showProfileOptions && (<ProfileOption
              onClose={() => setShowProfileOptions(false)}
              onShare={handleShareProfile}
              onReport={handleReport}
              onClearChat={handleClearChat}
              onBlock={handleBlock}
              isBlocked={isBlocked}
              onAbout={handleAboutProfile} />)}
          </div>
        </div>

        {/* Messages */}

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Connecting to chat...</p>
          </div>
        ) : (<div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">

          {messages.length == 0 ? (
            <div className="flex h-full justify-center items-center"><p className="  text-gray-400">No messages yet</p></div>
          ) : (messages.map((msg) => (
            <div key={msg.id}
              className={`p-2 rounded-lg max-w-xs ${msg.sender === "me" ? "bg-blue-200 ml-auto" : "bg-gray-200"
                }`}>
              {msg.type === "text" && <p>{msg.text}</p>}
              {(msg.type === "image" || msg.type === "camera") && (
                <img src={msg.url} alt={msg.fileName || "upload"} className="rounded-lg max-w-[200px]" />
              )}
              {msg.type === "document" && (
                <a
                  href={msg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {msg.fileName || "Document"}
                </a>
              )}

              {msg.type === "audio" && (
                <audio controls>
                  <source src={msg.url} type="audio/*" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {msg.type === "location" && msg.location && (
                <div className="flex flex-col space-y-1">
                  <a
                    href={`https://www.google.com/maps?q=${msg.location.lat},${msg.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={
                        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                          ? `https://maps.googleapis.com/maps/api/staticmap?center=${msg.location.lat},${msg.location.lng}&zoom=15&size=200x150&markers=color:red%7C${msg.location.lat},${msg.location.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
                          : `https://www.mapquestapi.com/staticmap/v5/map?key=${import.meta.env.VITE_MAPQUEST_API_KEY}&center=${msg.location.lat},${msg.location.lng}&size=200,150&zoom=15&locations=${msg.location.lat},${msg.location.lng}|marker-sm-50318A-1`
                      }
                      alt="Shared location"
                      className="rounded-lg shadow-md border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </a>

                  <a
                    href={`https://www.google.com/maps?q=${msg.location.lat},${msg.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}

            </div>
          )))}

          {isBlocked && (
            <div className="flex justify-center">
              <p className="text-red-600 font-semibold bg-red-100 px-4 py-2 rounded-lg">
                This user is blocked.
              </p>
            </div>
          )}

        </div>
        )}

        <div className="flex items-center p-3 gap-2">
          <button disabled={loading} onClick={() => setShowAttachment((prev) => !prev)}> <PlusIcon size={22} />
          </button>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handlesendMessage();
            }
          }} type="text" placeholder="Message..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none" disabled={loading} />


          <button
            onClick={handlesendMessage}
            className={`p-3 rounded-full text-white flex items-center justify-center ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
              }`}
            disabled={loading || isBlocked}
          >
            <Send size={22} />
          </button>

        </div>


      </div>

      {/* Attachment Menu */}

      {showAttachment && <AttachmentMenu
        onClose={() => setShowAttachment(false)}
        onFileSelect={handleFileUpload}
        onLocationSelect={handleLocationSelect}
      />}
      <div ref={bottomRef} />


    </div>


  )
}
export default ChatDetailPage;