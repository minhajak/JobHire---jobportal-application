import { useState } from "react";
import { requestConnection } from "../../../lib/axios/connectionInstance";

export  function useConnect({userId,onRemove}:{userId:string,onRemove:(id:string)=>void}) {
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = async (targetUserId: string, onSuccess?: () => void) => {
    setIsConnecting(true);
    setError(null);
    try {
       await requestConnection(targetUserId);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) { 
      const errorMessage =
        err instanceof Error ? err.message : "Error Requesting Connection";
      setError(new Error(errorMessage));
      console.log(err)
      return false; // Failure
    } finally {
      setIsConnecting(false);
    }
  };
  
   const handleConnect = async () => {
    if (!userId) return; // Add this check
    setIsConnecting(true);
    await connect(userId);

    if (onRemove) {
      onRemove(userId);
    }
  };
  
  const handleCloseCard = () => {
    if (userId && onRemove) {
      onRemove(userId);
    }
  };

  return {
    connect,
    isConnecting,
    error,
    handleCloseCard,
    handleConnect,
  };
}
