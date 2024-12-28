"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

type Timestamp = {
  start?: number;
  end?: number;
};

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [isTesting, setIsTesting] = useState(false);
  const { timestamp, start, end } = useTimestamp();
  const [pingLogs, setPingLogs] = useState<Timestamp[]>([]);

  useEffect(() => {
    if (timestamp?.start && timestamp?.end) {
      setPingLogs((prev) => [...prev, timestamp]);
    }
  }, [timestamp]);

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
    socket.on("reply", () => {
      end();
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const handleStart = () => {
    let intervalCount = 0;

    setIsTesting(true);
    const intervalId = setInterval(() => {
      start();
      socket.emit("message");
      intervalCount++;
      if (intervalCount === 20) {
        clearInterval(intervalId);
        setIsTesting(false);
      }
    }, 500);
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>

      <button disabled={isTesting} onClick={handleStart}>
        Start
      </button>
      <ul>
        {pingLogs.map(
          (log, index) =>
            log.start &&
            log.end && (
              <li key={index}>
                {" "}
                {index + 1} - {log.end - log.start}ms
              </li>
            )
        )}
      </ul>
    </div>
  );
}

const useTimestamp = () => {
  const [timestamp, setTimestamp] = useState<Timestamp | null>(null);

  const start = () => {
    const t = getCurrentTimestamp();
    setTimestamp({ start: t });
  };

  const end = () => {
    const t = getCurrentTimestamp();
    setTimestamp((prev) => ({ ...prev, end: t }));
  };

  const getCurrentTimestamp = () => {
    return new Date().getTime();
  };

  return {
    timestamp,
    start,
    end,
  };
};
