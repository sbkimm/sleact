import { useCallback } from "react";
import { Socket, io } from "socket.io-client";

const backUrl = "http://localhost:3095";

const sockets: { [key: string]: Socket } = {};
const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
      transports: ["websocket"], //polling말고 websocket을 쓰도록 명시
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
