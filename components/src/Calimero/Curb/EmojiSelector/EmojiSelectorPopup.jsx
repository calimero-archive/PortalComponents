const OnEmojiSelected = props.OnEmojiSelected;
const componentOwnerId = props.componentOwnerId;
const onClose = props.onClose;

const EmojiPopupContainer = styled.div`
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const CloseButton = styled.div`
  color: #fff;
  :hover {
    color: #5765f2;
  }
  z-index: 40;
  position: absolute;
  top: -30px;
  left: 140px;
  cursor: pointer;
`;

const CloseButtonContainer = styled.div`
  position: relative;
`;

return (
  <EmojiPopupContainer>
    <CloseButtonContainer>
      <CloseButton onClick={onClose}>
        <i className="bi bi-x-lg"></i>
      </CloseButton>
    </CloseButtonContainer>
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.EmojiSelector.EmojiSelector`}
      props={{
        OnEmojiSelected: (emoji) => OnEmojiSelected(emoji),
      }}
    />
  </EmojiPopupContainer>
);
