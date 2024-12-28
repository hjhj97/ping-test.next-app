import type { Timestamp } from "@/app/types/ping";

type PingLogListProps = {
  pingLogs: Timestamp[];
};

export const PingLogList = ({ pingLogs }: PingLogListProps) => {
  return (
    <ul>
      {pingLogs.map(
        (log, index) =>
          log.start &&
          log.end && (
            <li key={index}>
              {index + 1} - {log.end - log.start}ms
            </li>
          )
      )}
    </ul>
  );
};
