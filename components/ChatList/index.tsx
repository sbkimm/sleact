import React, { VFC, useCallback, useRef } from "react";
import { ChatZone } from "./styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";
import Scrollbars from "react-custom-scrollbars";

interface Props {
  chatData?: IDM[];
}

const ChatList: VFC<Props> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScroll={onScroll}>
        {chatData?.map((chat) => {
          return <Chat key={chat.id} data={chat} />;
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
