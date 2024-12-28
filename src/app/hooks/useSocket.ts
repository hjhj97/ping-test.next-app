import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { useTimestamp } from "./useTimestamp";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const { timestamp, start, end } = useTimestamp();

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("reply", end);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [end]);

  const onMessage = () => {
    start();
    socket.emit("message");
  };

  return {
    isConnected,
    transport,
    timestamp,
    end,
    onMessage,
  };
};
