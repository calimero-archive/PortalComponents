const componentOwnerId = props.componentOwnerId;
const contract = props.contract;
const encryptionUrl = props.encryptionUrl;
const accountId = props.accountId;
const enableCommunities = props.enableCommunities;
const wsApi = props.wsApi;
const handleContractChange = props.handleContractChange;
const initialChat = props.initialChat;
const updateInitialChat = props.updateInitialChat;
const communities = props.communities;

/**
 * Types of chats.
 * @typedef {object} ChatTypes
 * @property {string} CHANNEL - Designates a multi-user chat.
 * @property {string} DIRECT_MESSAGE - Designates a one-to-one chat.
 */
const ChatTypes = {
  CHANNEL: "channel",
  DIRECT_MESSAGE: "direct_message",
};

/**
 * `curbApi` is a utility object containing several methods for interacting
 * with a chat API and managing encryption in a chat application.
 *
 * @type {Object}
 * @property {function} createGroup - Sends an API request to create a new chat group.
 * @property {function} inviteUser - Invites a user to a channel.
 * @property {function} getChannels - Retrieves all channels that a user is part of.
 * @property {function} getDMs - Retrieves all direct messages for the user.
 * @property {function} getUnreadMessages - Retrieves all unread messages for the user.
 * @property {function} getChannelMeta - Fetches metadata about a particular channel.
 * @property {function} leaveChannel - Leaves a specified channel.
 * @property {function} createChannel - Creates a new channel.
 * @property {function} toggleReaction - Toggles a reaction to a message.
 * @property {function} fetchMessages - Fetches messages from a specified chat.
 * @property {function} fetchKey - Obtains the encryption key for a particular chat.
 * @property {function} sendMessage - Sends a message to a user or channel.
 *
 * @property {function} createGroup
 * @param {string} name - The name of the new group.
 * @returns {Promise} - A Promise that resolves with the result of the API call.
 *
 * @property {function} inviteUser
 * @param {Object} param
 * @param {string} param.account - The account of the user to invite.
 * @param {string} param.channel - The name of the channel to which the user is being invited.
 * @returns {Promise} - A Promise that resolves with the result of the API call.
 *
 * @property {function} getChannels
 * @returns {Promise<Array>} - A Promise that resolves with an array of channels.
 *
 * @property {function} fetchKey
 * @param {Object} param
 * @param {Object} param.chat - An object containing the chat details.
 * @returns {Promise<string>} - A Promise that resolves with the fetched key.
 *
 * @property {function} sendMessage
 * @param {Object} param
 * @param {string} param.message - The message to be sent.
 * @param {string} [param.img] - The image to be sent (if any).
 * @param {string} [param.toAccount] - The account to which the message is to be sent.
 * @param {string} [param.toChannel] - The channel to which the message is to be sent.
 * @param {string} param.key - The encryption key for the message.
 * @param {string} [param.threadId] - The ID of the thread to which the message belongs.
 * @throws {string} - Throws an error message if the required parameters are not valid.
 * @returns {Promise} - A Promise that resolves with the result of the API call.
 */
const curbApi = useMemo(() => {
  // Send transactions in order and wait for the previous transaction to be confirmed before sending the next one
  const meroshipSend = (method, params, callback) => {
    transactionQueue.push({ method, params, callback });
    processQueue();
  };

  let transactionQueue = [];
  let isProcessing = false;

  const processQueue = () => {
    if (transactionQueue.length === 0 || isProcessing) {
      return;
    }

    isProcessing = true;
    const { method, params, callback } = transactionQueue.shift();

    Calimero.fakSignTx(contract, method, params).then(([_, signedTx]) => {
      wsApi.methods.submitTx(signedTx, (err, result) => {
        if (err) {
          console.log(
            "Error: Calimero.Curb.AppContainer.meroshipSend error",
            contract,
            method,
            params,
            err
          );
          // add retry logic
          callback?.(err);
        } else {
          console.log("Calimero.Curb.AppContainer.meroshipSend result", result);
          callback?.(null, result);
        }
        isProcessing = false;
        processQueue();
      });
    });
  };

  const getStorageKey = (chatType, id) => `${contract}:${id}:${chatType}`;
  const fetchKey = ({ chat }) => {
    return new Promise((resolve, reject) => {
      if (!chat || !chat.type) {
        return reject(
          "Error: Invalid chat object, you need to provide a valid chat object to fetch the key"
        );
      }
      const storageKey = getStorageKey(
        chat.type,
        chat.type === ChatTypes.CHANNEL ? chat.name : chat.id
      );
      const storedEncriptionKey = Storage.privateGet(storageKey);
      if (storedEncriptionKey) {
        return resolve(storedEncriptionKey);
      }
      const nonce = toHexString(Crypto.randomBytes(16));
      Calimero.sign(contract, Buffer.from(accountId + "|" + nonce))
        .then((signature) => {
          const keyBody = {
            from: accountId,
            contract,
          };
          if (chat.type === ChatTypes.DIRECT_MESSAGE) {
            keyBody.dms = [chat.id];
          } else {
            keyBody.channels = [{ name: chat.name }];
          }
          keyBody.nonce = nonce;
          keyBody.signature = toHexString(signature.signature);

          return asyncFetch(encryptionUrl, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(keyBody),
          }).catch((e) => {
            return Promise.reject(e);
          });
        })
        .then((keyData) => {
          for (const [id, key] of Object.entries(keyData.body.dms)) {
            const storageKey = getStorageKey(ChatTypes.DIRECT_MESSAGE, id);
            Storage.privateSet(storageKey, key);
          }
          for (const [id, key] of Object.entries(keyData.body.channels)) {
            const storageKey = getStorageKey(ChatTypes.CHANNEL, id);
            Storage.privateSet(storageKey, key);
          }
          resolve(Storage.privateGet(storageKey));
        })
        .catch((e) => {
          console.log("Error: Calimero.Curb.AppContainer.fetchKey error", e);
          reject(e);
        });
    });
  };

  function extractAndAddMentions(inputText) {
    const regexPattern =
      /(@everyone)|(@here)|(@[a-zA-Z0-9_.-]+(?<![-.0-9])(?:\.testnet|\.near))/g;
    const uniqueMentions = new Set();
    let match;
    while ((match = regexPattern.exec(inputText)) !== null) {
      uniqueMentions.add(match[0].slice(1, match[0].length));
    }
    return Array.from(uniqueMentions);
  }

  const sendMessage = (
    { message, images, chat, files, threadId },
    callback
  ) => {
    if (!message && images?.length === 0 && files?.length === 0) {
      // Nothing to send
      return;
    }
    if (!chat) {
      throw "You need to provide a chat object to send the message";
    }
    return fetchKey({ chat }).then((key) => {
      const params = {};
      const encrypted = encrypt(message, images ?? [], files ?? [], key);
      const mentionsArray = extractAndAddMentions(message);
      if (chat.type === ChatTypes.DIRECT_MESSAGE) {
        params.account = chat.id;
      } else {
        params.group = { name: chat.name };
      }
      if (mentionsArray.length) {
        params.mentions = mentionsArray;
      }
      if (encrypted.images.length > 0) {
        params.images = encrypted.images;
      } else if (encrypted.files.length > 0) {
        params.files = encrypted.files;
      }

      params.message = encrypted.text;
      params.nonce = encrypted.nonce;
      params.timestamp = Date.now();
      params.parent_message = threadId ?? undefined;
      try {
        meroshipSend("send_message", params, callback);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  };
  const parseHexString = (hexString) => {
    const result = [];
    while (hexString.length >= 2) {
      result.push(parseInt(hexString.substring(0, 2), 16));
      hexString = hexString.substring(2, hexString.length);
    }
    return result;
  };

  const deleteMessage = ({ message, chat, callback }) => {
    const params = {
      message_id: message.id,
    };
    if (chat.type === ChatTypes.DIRECT_MESSAGE) {
      params.account = chat.id;
    } else {
      params.group = { name: chat.name };
    }
    if (message.parent_message) {
      params.parent_message = message.parent_message;
    }
    try {
      meroshipSend("delete_message", params, callback);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const toHexString = (byteArray) => {
    let result = "";
    for (let byte of byteArray) {
      result += ("0" + (byte & 0xff).toString(16)).slice(-2);
    }
    return result;
  };

  const encryptWithCipher = (data, key, nonce) => {
    const cipher = Crypto.createCipheriv(
      "aes-256-cbc",
      parseHexString(key),
      nonce
    );
    let encryptedData = cipher.update(data, "utf8", "base64");
    encryptedData += cipher.final("base64");
    return encryptedData;
  };

  const encrypt = (text, images, files, key, prevNonce) => {
    let nonce;
    if (prevNonce) {
      nonce = [];
      let hexString = prevNonce;
      while (hexString.length >= 2) {
        nonce.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
      }
    } else {
      nonce = Crypto.randomBytes(16);
    }
    console.log("prev", text, key, nonce, encrypted);
    let encrypted = encryptWithCipher(text, key, nonce);
    console.log("encrypt", text, key, nonce, encrypted);
    let encryptedImages = [];
    let encryptedFiles = [];
    if (images.length > 0) {
      encryptedImages = images.map((img) => ({
        name: encryptWithCipher("image.png", key, nonce),
        ipfs_cid: encryptWithCipher(img.ipfs_cid, key, nonce),
      }));
    } else if (files.length > 0) {
      // TODO: handle multiple files and images
      encryptedFiles = files.map((file) => ({
        name: encryptWithCipher(file.name, key, nonce),
        ipfs_cid: encryptWithCipher(file.ipfs_cid, key, nonce),
      }));
    }
    return {
      text: encrypted,
      images: encryptedImages,
      files: encryptedFiles,
      nonce: toHexString(nonce),
    };
  };

  function decryptMessages(messages, key) {
    if (!key || key.length === 0) {
      return [];
    }
    const decryptedMessages = messages.map((msg) => {
      return {
        ...msg,
        text: decrypt(msg.text, key, msg.nonce),
        files: msg.files?.length
          ? [
              {
                name: decrypt(msg.files[0].name, key, msg.nonce),
                ipfs_cid: decrypt(msg.files[0].ipfs_cid, key, msg.nonce),
              },
            ]
          : [],
        images: msg.images?.length
          ? [
              {
                name: decrypt(msg.images[0].name, key, msg.nonce),
                ipfs_cid: decrypt(msg.images[0].ipfs_cid, key, msg.nonce),
              },
            ]
          : [],
        reactions: msg.reactions ?? [],
      };
    });
    return decryptedMessages;
  }
  function decrypt(text, key, nonce) {
    if (!key) {
      return null;
    }
    const byteNonce = [];
    let hexString = nonce;
    while (hexString.length >= 2) {
      byteNonce.push(parseInt(hexString.substring(0, 2), 16));
      hexString = hexString.substring(2, hexString.length);
    }

    try {
      const decipher = Crypto.createDecipheriv(
        "aes-256-cbc",
        parseHexString(key),
        byteNonce
      );
      let decrypted = decipher.update(text, "base64", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (e) {
      console.log("Calimero.decrypt error: ", e.toString());
      return null;
    }
  }

  return {
    utils: { toHexString, parseHexString },
    decryptMessages,
    fetchKey,
    createGroup: (name, isPrivate, isReadOnly) =>
      Near.fakCalimeroCall(contract, "create_group", {
        group: { name },
        channel_type: isPrivate ? "Private" : "Public",
        read_only: isReadOnly,
        creator: accountId,
      }),
    inviteUser: ({ account, channel }) =>
      Near.fakCalimeroCall(contract, "group_invite", {
        group: { name: channel },
        account,
      }),
    getChannels: () =>
      Near.asyncCalimeroView(contract, "get_groups", {
        account: accountId,
      }).then((groups) =>
        groups.map((group) => ({ ...group, type: ChatTypes.CHANNEL }))
      ),
    getFilteredMembers: (namePrefix, channelName) =>
      Near.asyncCalimeroView(contract, "get_members", {
        name_prefix: namePrefix,
        group: { name: channelName },
        exclude: true,
      }).then((members) =>
        members.map((member) => ({
          ...member,
          type: ChatTypes.DIRECT_MESSAGE,
        }))
      ),
    getDMs: () =>
      Near.asyncCalimeroView(contract, "get_direct_messages", {
        account: accountId,
      }),
    fetchAccounts: ({ groupName, prefix, limit, exclude }) =>
      Near.asyncCalimeroView(contract, "get_members", {
        group: groupName ? { groupName } : undefined,
        name_prefix: prefix,
        limit,
        exclude,
      }),
    getAccountsStatus: (accounts) =>
      new Promise((resolve, reject) => {
        wsApi.methods.getAccountsStatus(accounts, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      }),
    getAppName: () =>
      Near.asyncCalimeroView(contract, "public_info").then(({ name }) => name),
    getChannelMembers: (channelName) =>
      Near.asyncCalimeroView(contract, "get_members", {
        group: { name: channelName },
      }),
    getUnreadMessages: () =>
      Near.asyncCalimeroView(contract, "unread_messages", {
        account: accountId,
      }),
    getChannelMeta: (channelName) =>
      Near.asyncCalimeroView(contract, "channel_info", {
        group: { name: channelName },
      }),
    promoteModerator: (accountId, channelName, isAdd) =>
      Near.fakCalimeroCall(contract, "set_group_moderator", {
        group: { name: channelName },
        moderator: accountId,
        is_add: isAdd,
      }),
    removeUserFromChannel: (accountId, channelName) =>
      Near.fakCalimeroCall(contract, "leave_group", {
        group: { name: channelName },
        account: accountId,
      }),
    leaveChannel: (channelName) =>
      Near.fakCalimeroCall(contract, "leave_group", {
        group: { name: channelName },
        account: accountId,
      }),
    createChannel: (channelName) =>
      Near.fakCalimeroCall(contract, "create_group", {
        group: { channelName },
      }),
    toggleReaction: ({ messageId, reaction }) => {
      meroshipSend("toggle_reaction", {
        message_id: messageId,
        reaction,
      });
    },
    fetchMessages: ({ chat, beforeId, afterId, limit, parentMessageId }) =>
      new Promise((resolve, reject) => {
        if (!chat || !chat.type) {
          reject(`Error: Invalid chat object ${JSON.stringify(chat)}`);
          return;
        }
        let args = { limit: 1000000 };
        if (chat.type === ChatTypes.CHANNEL && chat.name) {
          args.group = { name: chat.name };
        } else if (chat.type === ChatTypes.DIRECT_MESSAGE && chat.id) {
          args.accounts = [accountId, chat.id];
        } else {
          reject("Error: Invalid chat object");
          return;
        }
        if (beforeId) {
          args.before_id = beforeId;
        } else if (afterId) {
          args.after_id = afterId;
        }
        if (limit) {
          args.limit = limit;
        }
        if (parentMessageId) {
          args.parent_message = parentMessageId;
        }
        Promise.all([
          fetchKey({ chat }),
          Near.asyncCalimeroView(contract, "get_messages", args),
        ])
          .then(([key, messagesResponse]) => {
            const { messages, totalCount, startPosition } = messagesResponse;
            const result = {
              messages: decryptMessages(messages, key),
              totalCount,
              hasOlder: startPosition !== 0,
            };
            resolve(result);
          })
          .catch((e) => {
            console.log("Error: Calimero.Curb.Chat.fetchMessages error", e);
            reject(e);
          });
      }),
    sendMessage,
    deleteMessage,
    editMessage: ({ message, chat }) => {
      if (!chat || !chat.type) {
        return;
      }
      return fetchKey({ chat }).then((key) => {
        const params = {};
        console.log("editMessage", message, key, message.nonce);
        const encrypted = encrypt(
          message.text,
          message.images,
          message.files,
          key,
          message.nonce
        );
        if (chat.type === ChatTypes.DIRECT_MESSAGE) {
          params.account = chat.id;
        } else {
          params.group = { name: chat.name };
        }
        params.new_message = encrypted.text;
        params.message_id = message.id;
        params.images = [];
        params.files = [];
        if (encrypted.images && encrypted.images.length > 0) {
          params.images = encrypted.images;
        } else if (encrypted.files && encrypted.files.length > 0) {
          params.files = encrypted.files;
        }
        try {
          meroshipSend("edit_message", params);
        } catch (e) {
          return Promise.reject(e);
        }
      });
    },
    readMessage: ({ chat, messageId }) => {
      if (!chat || !chat.type) {
        return;
      }
      const readMessageParams =
        chat.type === ChatTypes.CHANNEL
          ? {
              group: { name: chat.name },
            }
          : {
              account: chat.id,
            };
      meroshipSend("read_message", {
        message_id: messageId,
        ...readMessageParams,
      });
    },
    getCommunities: (contracts) => {
      return Promise.all(
        contracts.map((contract) =>
          Near.asyncCalimeroView(contract, "public_info").then(
            (publicInfo) => ({
              ...publicInfo,
              assets: JSON.parse(publicInfo.assets),
              contract,
            })
          )
        )
      );
    },
  };
}, [contract, accountId]);

/**
 * Initial version of the chat object, currently only supports channels and p2p DMs.
 * @typedef {object} Chat
 * @property {string} type - Can be 'channel' or 'direct_message'.
 * @property {string} [name] - Name of the channel.
 * @property {string} [account] - Account for direct message.
 */
const [activeChat, setActiveChat] = useState({
  type: ChatTypes.CHANNEL,
  name: "general",
  readOnly: false,
});

useEffect(() => {
  if (initialChat) {
    setActiveChat(initialChat);
    updateInitialChat(initialChat);
  }
}, [initialChat]);

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const ContentDivContainer = styled.div`
  width: 100%;
  @media (min-width: 1025px) {
    height: calc(100vh - 169px);
    display: flex;
  }
`;

const Wrapper = styled.div`
  @media (min-width: 1025px) {
    flex: 1;
  }
`;
const updateSelectedActiveChat = useCallback((selectedChat) => {
  setActiveChat(selectedChat);
  setIsSidebarOpen(false);
  updateInitialChat(selectedChat);
}, []);

const [isWsConnectionActive, setIsWsConnectionActive] = useState(false);

useEffect(() => {
  let connected = () => setIsWsConnectionActive(true);
  let disconnected = () => setIsWsConnectionActive(false);

  wsApi.on("connected", connected).on("disconnected", disconnected).connect();

  return () =>
    wsApi
      .off("connected", connected)
      .off("disconnected", disconnected)
      .disconnect();
}, []);

return (
  <>
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.NavbarContainer`}
      props={{
        componentOwnerId,
        activeChat,
        isSidebarOpen,
        setIsSidebarOpen,
        curbApi,
        enableCommunities,
      }}
    />
    <ContentDivContainer>
      <Widget
        src={`${componentOwnerId}/widget/Calimero.Curb.ChannelsContainer`}
        props={{
          componentOwnerId,
          curbApi,
          onChatSelected: updateSelectedActiveChat,
          activeChat,
          isSidebarOpen,
          enableCommunities,
          isWsConnectionActive,
          wsApi,
          handleContractChange,
          communities,
          selectedCommunity: contract,
        }}
      />
      {!isSidebarOpen && (
        <Wrapper>
          <Widget
            src={`${componentOwnerId}/widget/Calimero.Curb.Chat.ChatContainer`}
            props={{
              componentOwnerId,
              contract,
              curbApi,
              activeChat,
              accountId,
              wsApi,
              isWsConnectionActive,
            }}
          />
        </Wrapper>
      )}
    </ContentDivContainer>
  </>
);
