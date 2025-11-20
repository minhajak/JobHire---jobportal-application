import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"
import { store, type AppState } from "../../../store/store";

const URL = import.meta.env.REACT_APP_API_URL
interface SocketContextType {
    socket: Socket | null;
}

const socketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = ():SocketContextType => useContext(socketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
      const token: string | null =
          (store.getState() as AppState).auth.accessToken ??
          localStorage.getItem("accessToken");
    const newSocket = io(URL, {
      transports: ["websocket"],
      auth: { token },
    });
    setSocket(newSocket);

   
  }, []);

   return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );

}
