import React, {
  MutableRefObject,
  VFC,
  forwardRef,
  useCallback,
  useRef,
} from "react";
import { ChatZone, Section, StickyHeader } from "./styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";
import Scrollbars from "react-custom-scrollbars";

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(
  ({ chatSections, setSize, isReachingEnd }, ref) => {
    const onScroll = useCallback(
      (values) => {
        if (values.target.scrollTop === 0 && !isReachingEnd) {
          setSize((prevSize) => prevSize + 1).then(() => {
            const current = (ref as MutableRefObject<Scrollbars>)?.current;
            if (current) {
              current.scrollTop(
                current.getScrollHeight() - values.target.scrollHeight
              );
            }
          });
        }
      },
      [ref, isReachingEnd, setSize]
    );

    return (
      <ChatZone>
        <Scrollbars autoHide ref={ref} onScroll={onScroll}>
          {Object.entries(chatSections).map(([date, chats]) => {
            return (
              <Section className={`section-${date}`} key={date}>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats.map((chat) => (
                  <Chat key={chat.id} data={chat} />
                ))}
              </Section>
            );
          })}
        </Scrollbars>
      </ChatZone>
    );
  }
);

export default ChatList;
