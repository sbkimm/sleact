import React, { VFC, useCallback, useEffect, useRef } from "react";
import {
  ChatArea,
  EachMention,
  Form,
  MentionsTextarea,
  SendButton,
  Toolbox,
} from "./styles";
import autosize from "autosize";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { IChannel, IUser } from "@typings/db";
import { useParams } from "react-router";
import gravatar from "gravatar";

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholer?: string;
}

const ChatBox: VFC<Props> = ({
  chat,
  onSubmitForm,
  onChangeChat,
  placeholer,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { workspace } = useParams<{ workspace?: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>("/api/users", fetcher);
  const { data: memberData } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm]
  );

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean
    ): React.ReactNode => {
      if (!memberData) {
        return;
      }
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, {
              s: "20px",
              d: "retro",
            })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    []
  );

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={handleKeyDown}
          placeholder={placeholer}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger={"@"}
            data={
              memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []
            }
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              "c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send" +
              (chat?.trim() ? "" : " c-texty_input__button--disabled")
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i
              className="c-icon c-icon--paperplane-filled"
              aria-hidden="true"
            />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
