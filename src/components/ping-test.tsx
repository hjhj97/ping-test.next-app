"use client";

import { useEffect, useState } from "react";

import { PingLogList } from "./ping-log-list";
import { Timestamp } from "@/app/types/ping";
import { useSocket } from "@/app/hooks/useSocket";

const INTERVAL = 500;
const INTERVAL_COUNT = 20;

export default function Home() {
  const [isTesting, setIsTesting] = useState(false);
  const [pingLogs, setPingLogs] = useState<Timestamp[]>([]);

  const { timestamp, isConnected, transport, onMessage } = useSocket();

  useEffect(() => {
    if (timestamp?.start && timestamp?.end) {
      setPingLogs((prev) => [...prev, timestamp]);
    }
  }, [timestamp]);

  const handleStart = () => {
    let intervalCount = 0;
    setIsTesting(true);

    function onMessageSending() {
      onMessage();
      intervalCount++;
      if (intervalCount === INTERVAL_COUNT) {
        clearInterval(intervalId);
        setIsTesting(false);
      }
    }

    const intervalId = setInterval(onMessageSending, INTERVAL);
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>

      <button disabled={isTesting} onClick={handleStart}>
        Start
      </button>
      <PingLogList pingLogs={pingLogs} />
    </div>
  );
}
