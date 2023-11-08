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
const resetImage = props.resetImage;
const sendMessage = props.sendMessage;
const getIconFromCache = props.getIconFromCache;
const isThread = props.isThread;
const isReadOnly = props.isReadOnly;
const toggleEmojiSelector = props.toggleEmojiSelector;
const isEmojiSelectorVisible = props.isEmojiSelectorVisible;
const channelMeta = props.channelMeta;
const channelUserList = props.channelUserList;
const setOpenMobileReactions = props.setOpenMobileReactions;
const openMobileReactions = props.openMobileReactions;
const onMessageDeletion = props.onMessageDeletion;
const onEditModeRequested = props.onEditModeRequested;
const onEditModeCancelled = props.onEditModeCancelled;
const onMessageUpdated = props.onMessageUpdated;

const ContainerPadding = styled.div`
  @media (max-width: 1024px) {
    height: calc(100vh - 160px) !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
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
  border-bottom: 2px solid #282933;
  display: flex;
  justify-content: space-between;
  @media (max-width: 1024px) {
    margin-right: 16px;
    padding-top: 104px;
  }
`;

const CloseSvg = styled.svg`
  fill: #777583;
  :hover {
    fill: #fff;
  }
  cursor: pointer;
`;

const Wrapper = styled.div`
  @media (max-width: 1024px) {
    width: 100% !important;
  }
`;

const containerPaddingStyle = {
  display: "flex",
  flexDirection: "row",
  paddingTop: "1rem",
  paddingLeft: "2.5rem",
  paddingRight: "2.5rem",
  paddingBottom: "2.5rem",
  scrollBehavior: "smooth",
  height: "calc(100vh - 241px)",
};
const chatStyle = {
  height: "",
  width: "",
};

const wrapperStyle = {
  height: "100%",
  width: "100%",
};

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

const loadInitialMessages = () => {
  if (isThread && openThread.id) {
    return curbApi.fetchMessages({
      chat: activeChat,
      limit: 20,
      parentMessageId: openThread.id,
    });
  }
  return curbApi.fetchMessages({ chat: activeChat, limit: 20 });
};

const loadPrevMessages = (id) => {
  if (isThread && id) {
    return curbApi.fetchMessages({
      chat: activeChat,
      beforeId: id,
      limit: 20,
      parentMessageId: openThread.id,
    });
  }
  return curbApi.fetchMessages({ chat: activeChat, beforeId: id, limit: 20 });
};

const setThread = useCallback((message) => {
  setOpenThread(message);
}, []);

const isModerator = useMemo(
  () =>
    channelUserList?.some(
      (user) => user.id === accountId && user.moderator === true
    ),
  [channelUserList, accountId]
);

const isOwner = accountId === channelMeta.createdBy;

const renderMessage = useMemo(
  () =>
    createMessageRenderer({
      handleReaction,
      getIconFromCache,
      accountId,
      isThread,
      openMobileReactions,
      setOpenMobileReactions,
      setThread: setThread ? setThread : undefined,
      toggleEmojiSelector,
      onEditModeRequested: onEditModeRequested,
      onEditModeCancelled: onEditModeCancelled,
      onMessageUpdated: onMessageUpdated,
      editable: () => false,
      deleteable: (message) => {
        if (message.sender === accountId) {
          return true;
        }
        return isOwner || isModerator;
      },
      onDeleteMessageRequested: (message) => {
        onMessageDeletion(message);
      },
    }),
  [accountId, isOwner, isModerator, openMobileReactions]
);

if (openThread && isThread) {
  chatStyle.height = "calc(100% - 124px)";
  chatStyle.width = "100%";
  chatStyle["overflow"] = "hidden";
  containerPaddingStyle.flexDirection = "column";
  containerPaddingStyle.paddingLeft = "0px";
  containerPaddingStyle.height = "100%";
  containerPaddingStyle["width"] = "100%";
  wrapperStyle.width = "100%";
} else if (openThread && !isThread) {
  chatStyle.height = "100%";
  chatStyle.width = "100%";
  containerPaddingStyle.paddingRight = "0px";
  wrapperStyle.width = "60%";
} else {
  chatStyle.height = "100%";
  chatStyle.width = "100%";
  chatStyle["overflow"] = "hidden";
}

const EmojiPopupContainer = styled.div`
  position: absolute;
  bottom: 70px;
  right: 2.5rem;
`;

return (
  <Wrapper style={wrapperStyle}>
    <ContainerPadding style={containerPaddingStyle}>
      {openThread && isThread && (
        <ThreadHeader
          openThread={openThread}
          onClose={() => setOpenThread(undefined)}
        />
      )}
      <VirtualizedChat
        loadInitialMessages={loadInitialMessages}
        loadPrevMessages={loadPrevMessages}
        deletedMessages={deletedMessages}
        incomingMessages={incomingMessages}
        updatedMessages={updatedMessages}
        onItemNewItemRender={readMessage}
        shouldTriggerNewItemIndicator={(message) =>
          message.sender !== accountId
        }
        render={renderMessage}
        chatId={isThread ? openThread.id : activeChat} // re-render the chat when the chat/thread changes
        style={chatStyle}
      />
    </ContainerPadding>
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.Chat.MessageInput`}
      props={{
        componentOwnerId,
        selectedChat:
          activeChat.type === "channel" ? activeChat.name : activeChat.id,
        sendMessage: sendMessage,
        resetImage: resetImage,
        openThread,
        isThread,
        isReadOnly,
        isOwner,
        isModerator,
      }}
    />
  </Wrapper>
);
