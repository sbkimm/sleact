import Workspace from "@layouts/Workspace";
import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import useInput from "@hooks/useInput";

const Channel = () => {
  const [chat, onChangeChat] = useInput("");

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox
        chat={chat}
        onSubmitForm={handleSubmit}
        onChangeChat={onChangeChat}
      />
    </Container>
  );
};

export default Channel;
