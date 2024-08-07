import Workspace from "@layouts/Workspace";
import React, { useCallback, useEffect, useRef } from "react";
import { Container, Header } from "./styles";
import { useParams } from "react-router";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import fetcher from "@utils/fetcher";
import gravatar from "gravatar";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";
import { IDM } from "@typings/db";
import makeSection from "@utils/\bmakeSection";
import Scrollbars from "react-custom-scrollbars";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(
    `/api/workspaces/${workspace}/users/${id}`,
    fetcher
  );
  const { data: myData } = useSWR("/api/users", fetcher);
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) =>
      `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${
        index + 1
      }`,
    fetcher
  );

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (chatData && chatData[chatData.length - 1]?.length < 20) ||
    false;
  console.log(isReachingEnd);
  const [chat, onChangeChat, setChat] = useInput("");
  const scrollbarRef = useRef<Scrollbars>(null);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        mutateChat((prevChatData) => {
          const savedChat = chat;
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat("");
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(
            `/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            mutateChat();
          })
          .catch(console.error);
      }
    },
    [chat, chatData]
  );

  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);

  if (!userData || !myData) return null;

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <img
          src={gravatar.url(userData.email, { s: "24px", d: "retro" })}
          alt={userData.nickname}
        />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox
        chat={chat}
        onSubmitForm={handleSubmit}
        onChangeChat={onChangeChat}
      />
    </Container>
  );
};

export default DirectMessage;
