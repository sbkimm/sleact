import Workspace from "@layouts/Workspace";
import React from "react";
import { Container, Header } from "./styles";
import { useParams } from "react-router";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import gravatar from "gravatar";
import ChatBox from "@components/ChatBox";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(
    `/api/workspaces/${workspace}/users/${id}`,
    fetcher
  );
  const { data: myData } = useSWR("/api/users", fetcher);

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
      <ChatBox chat="" />
    </Container>
  );
};

export default DirectMessage;
