const componentOwnerId = props.componentOwnerId;
const contract = props.contract;
const curbApi = props.curbApi;
const activeChat = props.activeChat;
const accountId = props.accountId;
const wsApi = props.wsApi;
const isWsConnectionActive = props.isWsConnectionActive;

const ChatContainer = styled.div`
  display: flex;
  @media (min-width: 1025px) {
    padding-left: 4px;
    height: calc(100vh - 169px);
  }
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    padding-top: 104px;
  }
`;

const ThreadWrapper = styled.div`
  height: 100%;
  flex: 1;
  border-left: 2px solid #282933;
  padding-left: 20px;
  @media (max-width: 1024px) {
    border-left: none;
    position: fixed;
    left: 0;
    right: 0; /* Set both left and right to 0 to stretch to full width */
    top: 50%; /* Vertically center the element */
    transform: translateY(-50%); /* Center it vertically */
    z-index: 30;
    background-color: #0e0e10;
  }
`;

const [openThread, setOpenThread] = useState(undefined);
const [incomingMessages, setIncomingMessages] = useState([]);
const [updatedMessages, setUpdatedMessages] = useState([]);
const [incomingThreadMessages, setIncomingThreadMessages] = useState([]);
const [updatedThreadMessages, setUpdatedThreadMessages] = useState([]);
const [isEmojiSelectorVisible, setIsEmojiSelectorVisible] = useState(false);
const [messageWithEmojiSelector, setMessageWithEmojiSelector] = useState(false);
const [channelMeta, setChannelMeta] = useState({});
const [channelUserList, setChannelUserList] = useState([]);

const [openMobileReactions, setOpenMobileReactions] = useState("");

useEffect(() => {
  if (activeChat.type === "channel") {
    curbApi.getChannelMeta(activeChat.name).then(setChannelMeta);
    curbApi.getChannelMembers(activeChat.name).then(setChannelUserList);
  }
}, [activeChat]);

const toggleEmojiSelector = useCallback(
  (message) => {
    setMessageWithEmojiSelector(message);
    setIsEmojiSelectorVisible((prev) => !prev);
  },
  [setIsEmojiSelectorVisible]
);

const activeChatRef = useRef(activeChat);
const openThreadRef = useRef(openThread);

useEffect(() => {
  if (activeChat.type === "channel" && isWsConnectionActive) {
    // todo! move this to page initialization
    // todo! basically, once the page has loaded,
    // todo! and we've fetched channels, subscribe to them
    wsApi.methods.subscribe(
      { [contract]: [activeChat.name] },
      (err, result) => {
        console.log("subscribed to", activeChat, err, result);
      }
    );
  }
  activeChatRef.current = activeChat;
}, [activeChat, isWsConnectionActive]);

useEffect(() => {
  setOpenThread(undefined);
}, [activeChat]);

useEffect(() => {
  openThreadRef.current = openThread;
}, [openThread]);

const computeReaction = useCallback((message, reaction, sender) => {
  const accounts = message.reactions[reaction] ?? [];
  let update;
  if (accounts.includes(sender)) {
    update = accounts.filter((a) => a !== sender);
  } else {
    update = [...accounts, sender];
  }
  return { reactions: { ...message.reactions, [reaction]: update } };
}, []);

useEffect(() => {
  const messageListener = (event) => {
    if (
      (activeChatRef.current.type === "direct_message" &&
        event.sender === activeChatRef.current.id) ||
      (activeChatRef.current.type === "channel" &&
        event.receiver.type === "channel" &&
        event.receiver.name === activeChatRef.current.name)
    ) {
      curbApi
        .fetchKey({ chat: activeChatRef.current })
        .then((key) => {
          const decrypted = curbApi.decryptMessages([event], key);
          if (event.parent_message === openThreadRef.current.id) {
            setOpenThread({
              ...openThreadRef.current,
              threadCount: openThreadRef.current.threadCount + 1,
            });
            setIncomingThreadMessages(decrypted);
          } else {
            setIncomingMessages(decrypted);
          }
        })
        .catch((err) => {
          console.log("Failing to decrypt message", err);
        });
    }
  };
  const reactionListener = (event) => {
    const { message_id, reaction, sender } = event;
    const updateFunction = (message) =>
      computeReaction(message, reaction, sender);
    setUpdatedMessages([{ id: message_id, descriptor: { updateFunction } }]);
  };

  const editsListener = (event) => {
    console.log("edited message", event);
    if (
      (activeChatRef.current.type === "direct_message" &&
        event.sender === activeChatRef.current.id) ||
      (activeChatRef.current.type === "channel" &&
        event.receiver.type === "channel" &&
        event.receiver.name === activeChatRef.current.name)
    ) {
      curbApi
        .fetchKey({ chat: activeChatRef.current })
        .then((key) => {
          const updates = curbApi.deleteMessage([event], key).map((m) => ({
            id: m.id,
            descriptor: {
              updatedFields: { ...m },
            },
          }));
          if (event.parent_message === openThreadRef.current.id) {
            console.log("updating thread messages", updates);
            setUpdatedThreadMessages(updates);
          } else {
            console.log("updating messages", updates);
            // TODO update thread parent if required
            setUpdatedMessages(updates);
          }
        })
        .catch((err) => {
          console.log("Failing to decrypt message", err);
        });
    }
  };

  const deleteListener = (event) => {
    if (
      (activeChatRef.current.type === "direct_message" &&
        event.sender === activeChatRef.current.id) ||
      (activeChatRef.current.type === "channel" &&
        event.receiver.type === "channel" &&
        event.receiver.name === activeChatRef.current.name)
    ) {
      handleDeleteMessage(event);
    }
  };

  wsApi?.notifications?.on("ChannelMessage", messageListener);
  wsApi?.notifications?.on("MessageReaction", reactionListener);
  wsApi?.notifications?.on("EditedMessage", editsListener);
  wsApi?.notifications?.on("DeletedMessage", deleteListener);
  return () => {
    wsApi?.notifications?.off("ChannelMessage", messageListener);
    wsApi?.notifications?.off("MessageReaction", reactionListener);
    wsApi?.notifications?.off("EditedMessage", editsListener);
    wsApi?.notifications?.off("DeletedMessage", deleteListener);
  };
}, [wsApi, curbApi]);

const readMessage = useCallback(
  (message) => {
    if (message?.id && message?.sender !== accountId) {
      // we don't report our own messages
      curbApi.readMessage({
        chat: activeChatRef.current,
        messageId: message.id,
      });
    }
  },
  [curbApi, accountId]
);

const handleReaction = useCallback(
  (message, reaction) => {
    const updates = [
      {
        id: message.id,
        descriptor: {
          updateFunction: (message) =>
            computeReaction(message, reaction, accountId),
        },
      },
    ];
    setUpdatedMessages(updates);
    setUpdatedThreadMessages(updates);
    curbApi.toggleReaction({ messageId: message.id, reaction });
  },
  [curbApi]
);

const convertCidToUrl = (file) =>
  file
    ? { ...file, ipfs_cid: `https://ipfs.near.social/ipfs/${file.cid}` }
    : null;

const createTemporalMessage = (text, img, uploadedFile, parentMessage) => {
  const images = img ? [convertCidToUrl(img)] : [];
  const files = uploadedFile?.file ? [convertCidToUrl(uploadedFile.file)] : [];
  const temporalId = curbApi.utils.toHexString(Crypto.randomBytes(16));

  return {
    id: temporalId,
    nonce: curbApi.utils.toHexString(Crypto.randomBytes(16)),
    reactions: [],
    images,
    files,
    sender: accountId,
    text,
    timestamp: Date.now(),
    temporalId,
    parent_message: parentMessage?.id,
  };
};

const submitMessage = (chat, message) =>
  new Promise((resolve, reject) => {
    curbApi.sendMessage(
      {
        message: message.text,
        chat,
        images: message.images,
        files: message.files,
        threadId: message.parent_message ? message.parent_message : undefined,
      },
      (err, result) => {
        if (result) {
          resolve(result.result.id);
        } else {
          reject(err);
        }
      }
    );
  });

const createSendMessageHandler =
  (chat, parentMessage) => (text, img, uploadedFile) => {
    const temporalMessage = createTemporalMessage(
      text,
      img,
      uploadedFile,
      parentMessage
    );

    const incomingCall = parentMessage
      ? setIncomingThreadMessages
      : setIncomingMessages;
    incomingCall([temporalMessage]);

    submitMessage(chat, temporalMessage)
      .then((realMessageId) => {
        const update = [
          {
            id: temporalMessage.id,
            descriptor: {
              updatedFields: { id: realMessageId, temporalId: undefined },
            },
          },
        ];

        if (parentMessage) {
          const parentUpdate = [
            {
              id: parentMessage.id,
              descriptor: {
                updateFunction: (message) => ({
                  threadCount: message.threadCount + 1,
                  threadLastTimestamp: Date.now(),
                }),
              },
            },
          ];
          setUpdatedThreadMessages(update);
          setUpdatedMessages(parentUpdate);
        } else {
          setUpdatedMessages(update);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

const sendMessage = useMemo(
  () => createSendMessageHandler(activeChat),
  [activeChat]
);
const sendThreadMessage = useMemo(
  () => createSendMessageHandler(activeChat, openThread),
  [activeChat, openThread]
);

const getIconFromCache = useCallback((accountId) => {
  const fallbackImage = "https://i.imgur.com/e8buxpa.png";
  return new Promise((resolve, _reject) => {
    const profile = Social.getr(`${accountId}/profile`);
    const baseImageObject = profile.image;
    if (
      !profile &&
      !baseImageObject.url &&
      !baseImageObject.ipfs_cid &&
      !baseImageObject.nft
    ) {
      resolve(fallbackImage);
    } else {
      resolve(
        `https://i.near.social/magic/thumbnail/https://near.social/magic/img/account/${accountId}`
      );
    }
  });
}, []);

const updateDeletedMessage = ({ id, parent_message }) => {
  const update = [{ id, descriptor: { updatedFields: { deleted: true } } }];
  if (parent_message) {
    const parentUpdate = [
      {
        id: parent_message,
        descriptor: {
          updateFunction: (message) => ({
            threadCount: message.threadCount - 1,
          }),
        },
      },
    ];
    setUpdatedThreadMessages(update);
    setUpdatedMessages(parentUpdate);
  } else {
    if (id === openThreadRef?.current?.id) {
      setOpenThread(undefined);
    }
    setUpdatedMessages(update);
  }
};

const handleDeleteMessage = useCallback(
  (message) => {
    updateDeletedMessage(message);
    curbApi.deleteMessage({ message, chat: activeChatRef.current });
  },
  [curbApi, activeChat]
);

const handleEditMode = useCallback((message) => {
  console.log("edit mode", message);
  const update = [
    {
      id: message.id,
      descriptor: {
        updatedFields: { editMode: !message.editMode },
      },
    },
  ];
  setUpdatedMessages(update);
}, []);

const handleEditedMessage = useCallback(
  (message) => {
    curbApi.editMessage({ message, chat: activeChat });
    const update = [
      {
        id: message.id,
        descriptor: {
          updatedFields: {
            text: message.text,
            editMode: false,
          },
        },
      },
    ];
    setUpdatedMessages(update);
  },
  [activeChat, curbApi]
);

const handleEditedThreadMessage = useCallback(
  (message) => {
    curbApi.editMessage({ message, chat: activeChat });
    const update = [
      {
        id: message.id,
        descriptor: {
          updatedFields: {
            text: message.text,
            editMode: false,
          },
        },
      },
    ];
    setUpdatedThreadMessages(update);
  },
  [activeChat, curbApi]
);

const selectThread = useCallback((message) => {
  console.log("select thread", message);
  setOpenThread(message);
  // reset thread updates
  setIncomingThreadMessages([]);
  setUpdatedThreadMessages([]);
}, []);

return (
  <ChatContainer>
    <>
      <Widget
        src={`${componentOwnerId}/widget/Calimero.Curb.Chat.ChatDisplaySplit`}
        props={{
          componentOwnerId,
          readMessage,
          handleReaction,
          openThread,
          setOpenThread: selectThread,
          activeChat,
          accountId,
          curbApi,
          incomingMessages,
          updatedMessages,
          resetImage: props.resetImage,
          sendMessage,
          getIconFromCache,
          isThread: false,
          isReadOnly: activeChat.readOnly,
          toggleEmojiSelector,
          channelMeta,
          channelUserList,
          openMobileReactions,
          setOpenMobileReactions,
          onMessageDeletion: handleDeleteMessage,
          onEditModeRequested: handleEditMode,
          onEditModeCancelled: handleEditMode,
          onMessageUpdated: handleEditedMessage,
        }}
      />
    </>
    {openThread.id && (
      <ThreadWrapper>
        <Widget
          src={`${componentOwnerId}/widget/Calimero.Curb.Chat.ChatDisplaySplit`}
          props={{
            componentOwnerId,
            readMessage,
            handleReaction,
            openThread,
            setOpenThread: selectThread,
            activeChat,
            accountId,
            curbApi,
            incomingMessages: incomingThreadMessages,
            updatedMessages: updatedThreadMessages,
            resetImage: props.resetImage,
            sendMessage: sendThreadMessage,
            getIconFromCache,
            isThread: true,
            isReadOnly: activeChat.readOnly,
            toggleEmojiSelector,
            channelMeta,
            channelUserList,
            openMobileReactions,
            setOpenMobileReactions,
            onMessageDeletion: handleDeleteMessage,
            onEditModeRequested: handleEditMode,
            onEditModeCancelled: handleEditMode,
            onMessageUpdated: handleEditedThreadMessage,
          }}
        />
      </ThreadWrapper>
    )}
    {isEmojiSelectorVisible && (
      <Widget
        src={`${componentOwnerId}/widget/Calimero.Curb.EmojiSelector.EmojiSelectorPopup`}
        props={{
          OnEmojiSelected: (emoji) => {
            handleReaction(messageWithEmojiSelector, emoji);
            setIsEmojiSelectorVisible(false);
          },
          onClose: () => setIsEmojiSelectorVisible(false),
          componentOwnerId,
        }}
      />
    )}
  </ChatContainer>
);
