import { useEffect, useState } from "react";
import { getMyConnections } from "../../../lib/axios/connectionInstance";
import type { ConnectType } from "../../../lib/types/connectType";

export default function useMyConnections() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connections, setConnections] = useState<ConnectType[]>([]);
  const [totalConnections, setTotalConnection] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        console.log("fetching User connections...........");
        const { data } = await getMyConnections();
        setConnections(data.connections);
        setTotalConnection(data.totalConnections);
        console.log(data)
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return {
    isLoading,
    connections,
    totalConnections,
  };
}
