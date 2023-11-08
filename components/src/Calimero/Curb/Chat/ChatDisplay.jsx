const componentOwnerId = props.componentOwnerId;
const readMessage = props.readMessage;
const handleReaction = props.handleReaction;
const openThread = props.openThread;
const setOpenThread = props.setOpenThread;
const activeChat = props.activeChat;
const curbApi = props.curbApi;
const accountId = props.accountId;
const incomingMessages = props.incomingMessages;
const updatedMessages = props.updatedMessages;
const incomingThreadMessages = props.incomingThreadMessages;
const updatedThreadMessages = props.updatedThreadMessages;
const resetImage = props.resetImage;
const sendMessage = props.sendMessage;
const getIconFromCache = props.getIconFromCache;

const ContainerPadding = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 1rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-bottom: 2.5rem;
  scroll-behavior: smooth;
  @media (min-width: 1025px) {
    height: calc(100vh - 241px);
  }
  @media (max-width: 1024px) {
    padding: 0rem;
    padding-top: 102px;
    padding-bottom: 82px;
    height: 100%;
  }
  scrollbar-color: black black;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: black;
    border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: black;
  }
  * {
    scrollbar-color: black black;
  }
  html::-webkit-scrollbar {
    width: 12px;
  }
  html::-webkit-scrollbar-thumb {
    background-color: black;
    border-radius: 6px;
  }
  html::-webkit-scrollbar-thumb:hover {
    background-color: black;
  }
`;

const Wrapper = styled.div`
  height: 100%;
`;

const [selectedParentMessage, setSelectedParentMessage] = useState(undefined);

const setThread = useCallback((message) => {
  setOpenThread(message);
}, []);

const renderMessage = useMemo(
  () =>
    createMessageRenderer({
      handleReaction,
      canDeleteMessage: isOwner || isMod,
      canEditMessage: isOwner,
      deleteMessage,
      getIconFromCache,
      accountId,
      setThread,
      isThread: false,
    }),
  [isOwner, isMod]
);

const renderThreadMessage = useMemo(
  () =>
    createMessageRenderer({
      handleReaction,
      getIconFromCache,
      accountId,
      isThread: true,
    }),
  [isOwner, isMod]
);

const ThreadTitle = styled.div`
  color: #fff;

  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
`;

const ThreadContainer = styled.div`
  position: relative;
  padding-bottom: 20px;
  margin-right: 2.5rem;
  border-bottom: 2px solid #282933;
  display: flex;
  justify-content: space-between;
`;

const CloseSvg = styled.svg`
  fill: #777583;
  :hover {
    fill: #fff;
  }
  cursor: pointer;
`;

const CloseButtonSvg = ({ onClose }) => (
  <CloseSvg
    onClick={onClose}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    className="bi bi-x-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
  </CloseSvg>
);

const ThreadHeader = ({ onClose }) => (
  <ThreadContainer>
    <ThreadTitle>Thread</ThreadTitle>
    <CloseButtonSvg onClose={onClose} />
  </ThreadContainer>
);

const ThreadWrapper = styled.div`
  height: 100%;
  flex: 1;
  border-left: 2px solid #282933;
  padding-left: 20px;
`;

const Divider = styled.div`
  border-bottom: 1px solid #282933;
  margin-top: 22px;
  margin-right: 2.5rem;
`;

useEffect(() => {
  curbApi
    .fetchMessages({
      chat: activeChat,
      limit: 20,
      parentMessageId: openThread.id,
    })
    .then((val) => console.log(val));
}, [openThread]);

return (
  <>
    <Wrapper>
      <ContainerPadding>
        <VirtualizedChat
          loadInitialMessages={() =>
            curbApi.fetchMessages({ chat: activeChat, limit: 20 })
          }
          loadPrevMessages={(id) =>
            curbApi.fetchMessages({ chat: activeChat, beforeId: id, limit: 20 })
          }
          incomingMessages={incomingMessages}
          updatedMessages={updatedMessages}
          onItemNewItemRender={readMessage}
          shouldTriggerNewItemIndicator={(message) =>
            message.sender !== accountId
          }
          render={renderMessage}
          chatId={activeChat}
          style={{ height: "100%", width: openThread ? "60%" : "100%" }}
        />
        {openThread && (
          <ThreadWrapper>
            <ThreadHeader
              openThread={openThread}
              onClose={() => setOpenThread(undefined)}
            />
            <Message
              message={openThread}
              accountId={accountId}
              handleReaction={handleReaction}
              openThread={() => {}}
              isThread={true}
              getIconFromCache={getIconFromCache}
            />
            <Divider />
            <VirtualizedChat
              loadInitialMessages={() =>
                curbApi.fetchMessages({
                  chat: activeChat,
                  limit: 20,
                  parentMessageId: openThread.id,
                })
              }
              loadPrevMessages={(id) =>
                curbApi.fetchMessages({
                  chat: activeChat,
                  beforeId: id,
                  limit: 20,
                  parentMessageId: openThread.id,
                })
              }
              incomingMessages={incomingThreadMessages}
              updatedMessages={updatedThreadMessages}
              shouldTriggerNewItemIndicator={() => false} // Never show new item indicator in thread
              render={renderThreadMessage}
              chatId={openThread.id}
              style={{
                height: "calc(100% - 146px)",
                width: "100%",
                overflow: "hidden",
              }}
            />
            <Widget
              src={`${componentOwnerId}/widget/Calimero.Curb.Chat.MessageInput`}
              props={{
                componentOwnerId,
                selectedChat:
                  activeChat.type === "channel"
                    ? activeChat.name
                    : activeChat.id,
                sendMessage: sendMessage,
                resetImage: resetImage,
                threadReply: openThread?.id,
                openThread,
                isThread: true,
              }}
            />
          </ThreadWrapper>
        )}
      </ContainerPadding>
    </Wrapper>
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.Chat.MessageInput`}
      props={{
        componentOwnerId,
        selectedChat:
          activeChat.type === "channel" ? activeChat.name : activeChat.id,
        sendMessage: sendMessage,
        resetImage: resetImage,
        threadReply: openThread?.id,
        openThread,
        isThread: false,
      }}
    />
  </>
);
