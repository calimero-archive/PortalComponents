const {
  componentOwnerId,
  threadReply,
  selectedChat,
  sendMessage,
  openThread,
  isThread,
  isReadOnly,
  isOwner,
  isModerator,
} = props;

State.init({
  img: null,
});

const Container = styled.div`
  position: absolute;
  bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #1d1d21;
  display: flex;
  align-items: end;
  @media (min-width: 1025px) {
    gap: 8px;
    border-radius: 4px;
  }
  @media (max-width: 1024px) {
    position: fixed;
    margin: 0 !important;
    left: 0;
    right: 0;
    bottom: 0px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    gap: 4px;
    margin: 0px;
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 12px;
    padding-top: 12px;
    width: 100% !important;
  }
`;

const EmojiPopupContainer = styled.div`
  position: absolute;
  bottom: 70px;
  right: 2.5rem;
`;

const UploadPopupContainer = styled.div`
  position: absolute;
  bottom: 70px;
  left: 2.5rem;
  @media (max-width: 1024px) {
    left: 30px;
  }
`;

const UploadContainer = styled.div`
  background-color: #0e0e10;
  border-radius: 0.375rem;
  width: fit-content;
  padding: 1rem;
`;

const [showEmojiPopup, setShowEmojiPopup] = useState(false);
const [showUpload, setShowUpload] = useState(false);
const [message, setMessage] = useState("");
const [showMarkdown, setShowMarkdown] = useState(false);
const [uploadedFile, setUploadedFile] = useState(null);
const [emojiSelectorOpen, setEmojiSelectorOpen] = useState(false);

const updateShowMarkdown = useCallback(() => {
  if (message) {
    setShowMarkdown(!showMarkdown);
  }
}, [message, showMarkdown]);

const setImage = useCallback(
  (img) => {
    State.update({ img: img });
  },
  [state.img]
);

const handleMessageChange = useCallback((mesage) => {
  setMessage(mesage);
}, []);

const resetImage = useCallback(() => State.update({ img: null }), []);
const resetFile = useCallback(() => setUploadedFile(null), []);
const resetMessage = useCallback(() => setMessage(""), []);
const emptyText = /^(\s*<p><br><\/p>\s*)*$/;
const markdownParser = (text) => {
  const toHTML = text.replace(
    /(\b(https?:\/\/[^\s<]+\/?)\b)|^(#####|####|###|##|#) (.*)$|(@everyone)|(@here)|(@[a-z\d]+[-_]*[a-z\d]+[-_]*[a-z\d]+\.(near|testnet))|<p><br><\/p>(?=\s*$)/gim,
    (
      match,
      url,
      url2,
      heading,
      text,
      everyoneMention,
      hereMention,
      validMention
    ) => {
      if (url || url2) {
        return `<a href="${url || url2}" class="url-link" target="_blank">${
          url || url2
        }</a>`;
      } else if (heading) {
        return text;
      } else if (everyoneMention) {
        return `<span class='mention-everyone'>@everyone</span>`;
      } else if (hereMention) {
        return `<span class='mention-here'>@here</span>`;
      } else if (validMention) {
        return `<span class='mention mention-user-${validMention
          .replace("@", "")
          .replace(/\./g, "\\.")
          .replace(/_/g, "\\_")}'>${validMention}</span>`;
      } else {
        return "";
      }
    }
  );

  return toHTML;
};

const isActive =
  (message && !emptyText.test(markdownParser(message))) ||
  state.img ||
  uploadedFile;

const handleSendMessage = useCallback(() => {
  if (
    (uploadedFile && !uploadedFile.file.cid) ||
    (state.img && !state.img.cid)
  ) {
    return;
  } else if (
    emptyText.test(markdownParser(message)) &&
    !state.img &&
    !uploadedFile
  ) {
    handleMessageChange("");
  } else {
    sendMessage(markdownParser(message), state.img, uploadedFile, openThread);
    resetImage();
    resetFile();
    setShowUpload(false);
    setEmojiSelectorOpen(false);
    handleMessageChange("");
  }
}, [message, state.img, uploadedFile, openThread]);

const [selectedEmoji, setSelectedEmoji] = useState("");

const IconSvg = styled.svg`
  margin-bottom: 8px;
  :hover {
    fill: #fff;
  }
  cursor: pointer;
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: end;
`;

const FullWidthWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const IconUpload = ({ onClick }) => (
  <IconSvg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="#686672"
    className="bi bi-plus-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
  </IconSvg>
);

const EmojiContainer = styled.div`
  border-radius: 2px;
  margin-bottom: 4px;
  height: 26px;
  width: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  cursor: pointer;

  .hidden-svg {
    visibility: hidden;
    position: absolute;
    z-index: -10;
  }

  .visible-svg {
    visibility: visible;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const IconEmoji = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <EmojiContainer
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="#686672"
        className={`bi bi-emoji-wink ${hovered ? "hidden-svg" : "visible-svg"}`}
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm1.757-.437a.5.5 0 0 1 .68.194.934.934 0 0 0 .813.493c.339 0 .645-.19.813-.493a.5.5 0 1 1 .874.486A1.934 1.934 0 0 1 10.25 7.75c-.73 0-1.356-.412-1.687-1.007a.5.5 0 0 1 .194-.68z" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="#FFDD1D"
        className={`bi bi-emoji-wink-fill ${
          hovered ? "visible-svg" : "hidden-svg"
        }`}
        viewBox="0 0 16 16"
      >
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM7 6.5C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5zM4.285 9.567a.5.5 0 0 0-.183.683A4.498 4.498 0 0 0 8 12.5a4.5 4.5 0 0 0 3.898-2.25.5.5 0 1 0-.866-.5A3.498 3.498 0 0 1 8 11.5a3.498 3.498 0 0 1-3.032-1.75.5.5 0 0 0-.683-.183zm5.152-3.31a.5.5 0 0 0-.874.486c.33.595.958 1.007 1.687 1.007.73 0 1.356-.412 1.687-1.007a.5.5 0 0 0-.874-.486.934.934 0 0 1-.813.493.934.934 0 0 1-.813-.493z" />
      </svg>
    </EmojiContainer>
  );
};

const IconSendSvg = styled.svg`
  margin-bottom: 8px;
  :hover {
    fill: #4e95ff;
  }
  cursor: pointer;
`;
const IconSend = ({ onClick, isActive }) => (
  <IconSendSvg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill={`${isActive ? "#4E95FF" : "#686672"}`}
    className="bi bi-send-fill"
    viewBox="0 0 16 16"
  >
    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
  </IconSendSvg>
);

const Placeholder = styled.div`
  position: absolute;
  z-index: 10;
  bottom: 16px;
  left: 52px;
  color: #686672;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  pointer-events: none;
  @media (max-width: 1024px) {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    bottom: 16px;
    left: 40px;
  }
`;

const getCustomStyle = (openThread) => {
  const customStyle = {
    width: "calc(100% - 440px)",
    marginLeft: "2.5rem",
    marginRight: "2.5rem",
  };
  if (openThread && !isThread) {
    customStyle.width = "calc(60% - 262px)";
    customStyle.marginRight = "1.25rem";
  } else if (!openThread && !isThread) {
    customStyle.width = "calc(100% - 440px)";
  } else if (openThread && isThread) {
    customStyle.width = "calc(40% - 212px)";
    customStyle.marginLeft = "0rem";
    customStyle.marginRight = "1.25rem";
  }
  return customStyle;
};

const ReadOnlyField = styled.div`
  background-color: #111111;
  height: 2rem;
  border-radius: 4px;
  padding: 4px 8px 4px 8px;
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: #797978;
  flex: 1;
  @media (max-width: 1024px) {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
`;

let canWriteMessage = false;
if (isReadOnly) {
  if (isModerator || isOwner) {
    canWriteMessage = true;
  } else {
    canWriteMessage = false;
  }
} else {
  canWriteMessage = true;
}

return (
  <>
    {canWriteMessage && (
      <Container
        style={getCustomStyle(openThread, isThread)}
        key={openThread.id}
      >
        <IconUpload
          onClick={() => {
            setEmojiSelectorOpen(false);
            setShowUpload(!showUpload);
            console.log(showUpload);
          }}
        />
        <Wrapper>
          <FullWidthWrapper>
            <MarkdownEditor
              setValue={setMessage}
              value={message}
              onChange={handleMessageChange}
              selectedEmoji={selectedEmoji}
              resetSelectedEmoji={() => setSelectedEmoji("")}
              handleMessageSent={handleSendMessage}
            />
          </FullWidthWrapper>
          {(!message || emptyText.test(markdownParser(message))) && (
            <Placeholder>
              {openThread && isThread
                ? `Reply in thread`
                : `Type message in ${selectedChat}`}
            </Placeholder>
          )}
        </Wrapper>
        <div onClick={() => setEmojiSelectorOpen(!emojiSelectorOpen)}>
          <IconEmoji />
        </div>
        <IconSend
          onClick={() => {
            if (isActive) {
              handleSendMessage();
            }
          }}
          isActive={isActive}
        />
        {emojiSelectorOpen && (
          <EmojiPopupContainer>
            <Widget
              src={`${componentOwnerId}/widget/Calimero.Curb.EmojiSelector.EmojiSelector`}
              props={{
                OnEmojiSelected: (emoji) => setSelectedEmoji(emoji),
              }}
            />
          </EmojiPopupContainer>
        )}
        {showUpload && (
          <UploadPopupContainer>
            <UploadContainer>
              {!uploadedFile && (
                <Widget
                  src={`${componentOwnerId}/widget/Calimero.Curb.Chat.UploadImage`}
                  props={{
                    imageUp: state.img,
                    uploadComponent: (
                      <IpfsImageUpload
                        image={state.img}
                        className="btn btn-secondary"
                      />
                    ),
                    resetImage: resetImage,
                  }}
                />
              )}
              {!state.img && (
                <Widget
                  src={`${componentOwnerId}/widget/Calimero.Curb.Chat.FileUpload`}
                  props={{
                    uploadedFile: uploadedFile,
                    setUploadedFile: setUploadedFile,
                    resetFile: resetFile,
                  }}
                />
              )}
            </UploadContainer>
          </UploadPopupContainer>
        )}
      </Container>
    )}
    {!canWriteMessage && (
      <Container
        style={getCustomStyle(openThread, isThread)}
        key={openThread.id}
      >
        <ReadOnlyField>
          You don't have permissions to write in this channel
        </ReadOnlyField>
      </Container>
    )}
  </>
);
