const MessageContainer = styled.div`
  padding-top: 8px;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${({ isTemporal }) => isTemporal && "opacity: 0.5;"}
  @media (max-width: 1024px) {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    padding-left: 18px;
    padding-right: 18px;
  }
  .ReactionsContainer {
    display: none;
  }

  &:hover .ReactionsContainer {
    display: flex;
  }
`;

const SenderInfoContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  display: flex;
  justify-content: flex-start;
`;

const ProfileIconContainerMsg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  ${({ id }) => id && `background-color: #111;`}
  text-align: center;
  /* Body/Small */
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 21px */
`;

const NameContainerSender = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  color: #6c757d;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
`;
const ReactionsContainer = styled.div`
  display: none;
  position: absolute;
  height: 26px;
  z-index: 30;
  top: -2rem;
  right: 1rem;
  column-gap: 0.5rem;
  font-size: 1.5rem;
  line-height: 1.75rem;
  cursor: pointer;
  background: #0e0e10;
  border-radius: 4px;
  padding-left: 2rem;
  padding-right: 2px;
  padding-top: 2px;
  padding-bottom: 0px;
`;

const MessageText = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  padding-top: 0px;
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  @media (max-width: 1024px) {
    max-width: 320px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
  iframe {
    height: 24px;
  }
`;

const EmojiContainer = styled.p`
  height: 24px;
  width: 24px;
  border-radius: 4px;
  :hover {
    background-color: #5765f2;
  }
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReactedContainer = styled.div`
  display: flex;
  position: relative;
  bottom: 0rem;
  left: 0rem;
  column-gap: 0.5rem;
  font-size: 1rem;
  line-height: 1rem;
  cursor: pointer;
  border-radius: 4px;
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
`;

const EmojiReactedContainer = styled.div`
  position: relative;
`;

const EmojiCountContainer = styled.div`
  font-size: 0.75rem;
  line-height: 1rem;
  position: absolute;
  bottom: -0.7rem;
  left: 0.5rem;
  background-color: #1d1d21;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  text-align: center;
`;

const ImageContainer = styled.img`
  padding-left: 2rem;
  padding-top: 8px;
  border-radius: 4px;
  max-height: 400px;
  max-width: 400px;
  object-fit: contain;
  @media (max-width: 1024px) {
    max-height: 300px;
    max-width: 300px;
  }
`;

const ReactionsWrapper = styled.div`
  display: flex;
  position: relative;
  margin-top: 2px;
  margin-left: 2.5rem;
  column-gap: 0.25rem;
  font-size: 1rem;
  line-height: 1rem;
  cursor: pointer;
`;

const reactionsArray = [
  {
    emoji: "😠",
    title: "Angry Face",
  },
  {
    emoji: "❤️",
    title: "Red Heart",
  },
  {
    emoji: "😀",
    title: "Grinning Face",
  },
  {
    emoji: "😂",
    title: "Face with Tears of Joy",
  },
  {
    emoji: "👍",
    title: "Thumbs Up",
  },
  {
    emoji: "👎",
    title: "Thumbs Down",
  },
  {
    emoji: "✅",
    title: "Check Mark Button",
  },
];

const formatTimeAgo = (timestampInSeconds, flag) => {
  const now = new Date();
  const timestamp = new Date(timestampInSeconds * 1000);
  if (
    timestamp.getDate() === now.getDate() &&
    timestamp.getMonth() === now.getMonth() &&
    timestamp.getFullYear() === now.getFullYear()
  ) {
    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    return flag ? `today at ${hours}:${minutes}` : `${hours}:${minutes}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    timestamp.getDate() === yesterday.getDate() &&
    timestamp.getMonth() === yesterday.getMonth() &&
    timestamp.getFullYear() === yesterday.getFullYear()
  ) {
    return "yesterday";
  }
  const day = timestamp.getDate().toString().padStart(2, "0");
  const month = (timestamp.getMonth() + 1).toString().padStart(2, "0");
  const year = timestamp.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseReactions = (reactions) => {
  if (!reactions) {
    return [];
  }
  return Object.keys(reactions).map((reaction) => {
    const accountsForReaction = Array.isArray(reactions[reaction])
      ? reactions[reaction]
      : [];
    return {
      reaction,
      accounts: accountsForReaction,
    };
  });
};

const [messageReactions, setMessageReactions] = useState(
  parseReactions(props.message.reactions)
);

useEffect(() => {
  const newReactions = parseReactions(props.message.reactions);
  if (newReactions !== messageReactions) {
    setMessageReactions(newReactions);
  }
}, [props.message.reactions]);

const handleReaction = (reactionData) => {
  const emoji = reactionData;

  let newMessageReactions = [...messageReactions];

  const existingReactionIndex = newMessageReactions.findIndex(
    (r) => r.reaction === emoji
  );

  if (existingReactionIndex !== -1) {
    const existingReaction = newMessageReactions[existingReactionIndex];
    const hasUserReacted = existingReaction.accounts.includes(
      context.accountId
    );
    if (hasUserReacted) {
      existingReaction.accounts = existingReaction.accounts.filter(
        (account) => account !== context.accountId
      );
      if (!existingReaction.accounts.length) {
        newMessageReactions.splice(existingReactionIndex, 1);
      }
    } else {
      existingReaction.accounts.push(context.accountId);
    }
  } else {
    newMessageReactions.push({
      reaction: emoji,
      accounts: [context.accountId],
    });
  }
  setMessageReactions(newMessageReactions);
  props.addMessageReaction({
    messageId: props.message.id,
    emoji,
  });
};

const text = props.message.text;
const isTemporal = props.message.isTemporal;
const overLayContainer = styled.div`
  z-index: 40;
  display: flex;
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  background-color: #0e0e10;
  border: 1px solid #777583;
  border-radius: 0.375rem;
  font-size: 16px;
  padding-left: 24px;
  margin-top: 0.725rem;
  color: #fff;
`;

const MessageUrls = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: #ffdd1d;
  cursor: pointer;
  :hover {
    color: #ffdd1d;
    text-decoration: underline;
  }
  :visited {
    color: #d0fc42;
  }
`;

const FileContainer = styled.a`
  min-width: 172px;
  max-width: 172px;
  margin-top: 4px;
  margin-left: 2.5rem;
  text-decoration: none;
  :hover {
    text-decoration: none;
  }
  display: flex;
  gap: 4px;
  border-radius: 2px;
  background-color: #1d1d21;
  padding: 4px;
  :hover {
    background-color: #2a2b37;
  }
`;
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4E95FF;
  border-radius: 2px;
  width: 2rem;
  height: 2rem;
  padding: 0.5rem:
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileTitle = styled.div`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 130px;
`;

const FileExtension = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  color: #5c5c71;
`;

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="white"
    className="bi bi-file-earmark-fill"
    viewBox="0 0 16 16"
  >
    <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
  </svg>
);

const storageKey = "lastReportedMessage";
const oldReportedId = Storage.privateGet(storageKey);

let finalText = "";
let ipfsImage = null;
let ipfsFile = null;

if (props.message.images) {
  ipfsImage = props.message.images;
} else if (props.message.files) {
  ipfsFile = props.message.files;
}

if (text) {
  const hasMention =
    text.includes(`@${context.accountId}`) ||
    text.includes("@everyone") ||
    text.includes("@here");

  finalText = `
    <style>
      .mention {
        color: #fff;
        background-color: #343C93;
      }
      .mention-${context.accountId.replace(/[@.]/g, "-")} {
        color: #FEAE37;
        background-color: #83522F;
      }
      .url-link {
        cursor: pointer;
        text-decoration: none;
        color: #4e95ff;
        cursor: pointer;
          }  
    .url-link:hover {
        color: #74abff;
        text-decoration: underline;
      }
    .url-link:visited {
        color: #4e95ff;
      }
    .text-container {
      color: #fff;
      font-family: Helvetica Neue;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%;
      padding-left: 2.5rem;
      ${hasMention && "background-color: rgba(131, 82, 47, 0.35);"}
    }
    ul {
      padding-left: 1rem;
      margin: 0;
    }
    ol {
      padding-left: 1rem;
      margin: 0;
    }
    .time-container {
      position: absolute;
      bottom: 0px;
      right: 0px;
      color: #777583;
      font-family: Helvetica Neue;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
      @media (max-width: 1024px) {
        bottom: -1rem;
        right: 4px;
      }
    }
    </style>
    <script>
      const handleMessage = (text) => {
        document.getElementById("text-container").innerHTML = text;
      };
      window.iFrameResizer = {
        onMessage: handleMessage
      }
    </script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.js"></script>
    <div class="text-container">
    ${text}
      <div class="time-container">
        ${formatTimeAgo(props.message.timestamp / 1000, false)}
      </div>
    </div>
  `;
}

const overlay = <overLayContainer>Reply in thread</overLayContainer>;

return (
  text && (
    <>
      <MessageContainer isTemporal={!!props.message.isTemporal}>
        <SenderInfoContainer>
          <div>
            <ProfileIconContainerMsg>
              <Widget
                src={`${props.componentOwnerId}/widget/Calimero.Curb.ProfileIcon.UserProfileIcon`}
                props={{
                  accountId: props.message.sender,
                  showStatus: false,
                  componentOwnerId: props.componentOwnerId,
                  width: "32px",
                  height: "32px",
                }}
              />
            </ProfileIconContainerMsg>
          </div>
          <div>
            <NameContainerSender>{props.message.sender}</NameContainerSender>
          </div>
        </SenderInfoContainer>
        <MessageText
          ownMessage={props.message.sender === context.accountId}
          clickable={ipfsImage}
        >
          <iframe
            iframeResizer={{
              bodyMargin: 0,
              bodyPadding: 0,
            }}
            minHeight={"200px"}
            srcDoc={finalText}
            class="styled-iframe"
            className="w-100"
          />
          <ReactionsContainer className="ReactionsContainer">
            {reactionsArray && (
              <>
                {reactionsArray?.map((reaction, id) => (
                  <EmojiContainer
                    onClick={() => handleReaction(reaction.emoji)}
                    key={id}
                  >
                    {reaction.emoji}
                  </EmojiContainer>
                ))}
                {!props.isThread && (
                  <EmojiContainer
                    onClick={() => props.setThread(props.message.id)}
                  >
                    <OverlayTrigger
                      show={state.show}
                      trigger={["hover", "focus"]}
                      delay={{ show: 250, hide: 300 }}
                      placement="auto"
                      overlay={overlay}
                    >
                      <i className="bi bi-reply text-light"></i>
                    </OverlayTrigger>
                  </EmojiContainer>
                )}
              </>
            )}
          </ReactionsContainer>
          {ipfsImage && (
            <Widget
              src={`${props.componentOwnerId}/widget/Calimero.Common.Popups.ImagePopup`}
              props={{
                title: ipfsImage.name,
                imgSrc: `https://ipfs.near.social/ipfs/${ipfsImage.ipfs_cid}`,
                componentOwnerId: props.componentOwnerId,
                toggle: (
                  <div>
                    <ImageContainer
                      src={`https://ipfs.near.social/ipfs/${ipfsImage.ipfs_cid}`}
                      alt="uploaded"
                    />
                  </div>
                ),
              }}
            />
          )}
          {ipfsFile && (
            <FileContainer
              href={`https://ipfs.near.social/ipfs/${ipfsFile.ipfs_cid}`}
              target="_blank"
            >
              <IconContainer>
                <FileIcon className="bi bi-file-earmark-fill" />
              </IconContainer>
              <FileInfo>
                <FileTitle>{ipfsFile.name}</FileTitle>
                <FileExtension>
                  {ipfsFile.name.split(".").pop().toUpperCase()}
                </FileExtension>
              </FileInfo>
            </FileContainer>
          )}
          {messageReactions.length > 0 && (
            <ReactionsWrapper>
              {messageReactions?.map(
                (reaction, id) =>
                  reaction.accounts.length > 0 && (
                    <Widget
                      src={`${props.componentOwnerId}/widget/Calimero.Curb.Chat.Reaction`}
                      key={id}
                      reaction={reaction}
                      props={{
                        reaction,
                        handleReaction,
                      }}
                    />
                  )
              )}
            </ReactionsWrapper>
          )}
        </MessageText>
      </MessageContainer>
      {props.message.thread.length > 0 && (
        <Widget
          src={`${props.componentOwnerId}/widget/Calimero.Curb.Chat.ReplyContainerButton`}
          props={{
            replyCount: props.message.thread.length,
            onClick: () => {
              props.setThread(props.message.id);
            },
            time: formatTimeAgo(
              props.message.thread[props.message.thread.length - 1].timestamp /
                1000,
              true
            ),
          }}
        />
      )}
      {oldReportedId === props.message.id &&
        props.lastMessageId !== oldReportedId &&
        props.message.sender !== context.accountId && (
          <Widget
            src={`${props.componentOwnerId}/widget/Calimero.Curb.Chat.UnreadBadge`}
          />
        )}
    </>
  )
);
