const TheadsContainer = styled.div`
  width: 100%;
  background-color: #0e0e10;
  padding-left: 1.125rem;
  padding-right: 1.125rem;
  pading-top: 2rem;
  padding-bottom: 1rem;
  color: #fff;
  @media (max-width: 1024px) {
    padding-bottom: 1rem;
    padding-left: 0rem;
    padding-right: 0rem;
    margin-bottom: 10px;
  }
`;

const ThreadTitle = styled.h4`
  padding-bottom: 24px;
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  @media (max-width: 1024px) {
    font-size: 18px;
    font-weight: 400;
  }
}
`;

const CloseButton = styled.div`
  color: #fff;
  :hover {
    color: #5765f2;
  }
  z-index: 40;
  relative: absolute;
  margin-top: 10px;
  top: 10px;
  right: 1rem;
  cursor: pointer;
`;

const ReplyMessageContainer = styled.div`
  padding-top: 1rem;
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 1rem;
  margin-bottom: 26px;
  border-bottom: 1px solid #282933;
  @media (max-width: 1024px) {
    font-size: 14px;
    font-weight: 400;
    padding-left: 18px;
    padding-right: 18px;
  }
`;

const SenderInfoContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  display: flex;
  justify-content: flex-start;
  margin-top: 26px;
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
  margin-left: -8px;
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

const ImageContainer = styled.img`
  border-radius: 4px;
  cursor: pointer;
  max-width: 400px;
  max-height: 400px;
  @media (max-width: 1024px) {
    max-width: 300px;
    max-height: 300px;
  }
`;

const ReplyTextContainer = styled.div`
  position: relative;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  @media (max-width: 1024px) {
    font-size: 14px;
    max-width: 320px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #282933;
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

console.log("THREAD message", props.message);
const text = props.message.text;

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

return (
  <TheadsContainer>
    <ReplyMessageContainer>
      <Header>
        <ThreadTitle>Thread</ThreadTitle>
        <CloseButton onClick={() => props.setOpenThreadId(undefined)}>
          <i className="bi bi-x-lg"></i>
        </CloseButton>
      </Header>
      <SenderInfoContainer
        ownMessage={props.message.sender === context.accountId}
      >
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
      <ReplyTextContainer>
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
      </ReplyTextContainer>
    </ReplyMessageContainer>
    {props.message.thread.length > 0 &&
      props.message.thread.map((message) => (
        <Widget
          src={`${props.componentOwnerId}/widget/Calimero.Curb.Chat.UserMessage`}
          props={{
            componentOwnerId: props.componentOwnerId,
            message,
            addMessageReaction: props.addMessageReaction,
            isThread: true,
            setImage: (src) => props.setImage(src),
          }}
          key={message.id}
        />
      ))}
  </TheadsContainer>
);
