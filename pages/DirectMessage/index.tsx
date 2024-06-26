import Workspace from "@layouts/Workspace";
import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import { useParams } from "react-router";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import gravatar from "gravatar";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";
import { IDM } from "@typings/db";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(
    `/api/workspaces/${workspace}/users/${id}`,
    fetcher
  );
  const { data: myData } = useSWR("/api/users", fetcher);
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher
  );
  const [chat, onChangeChat, setChat] = useInput("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
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
            setChat("");
          })
          .catch(console.error);
      }
    },
    [chat]
  );

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>
        <img
          src={gravatar.url(userData.email, { s: "24px", d: "retro" })}
          alt={userData.nickname}
        />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox
        chat={chat}
        onSubmitForm={handleSubmit}
        onChangeChat={onChangeChat}
      />
    </Container>
  );
};

export default DirectMessage;
