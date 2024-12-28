import { useState } from "react";
import type { Timestamp } from "@/app/types/ping";

export const useTimestamp = () => {
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
