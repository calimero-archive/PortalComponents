const PopupContainer = styled.div`
  position: relative;
  background-color: #1d1d21;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: start;
  max-width: 80vh;
  max-height: 80vh;
  outline: none;
`;

const OverlayContainer = styled.div`
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 20;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  @media (max-width: 1024px) {
    height: 100vh;
  }
`;

const FullScreenImage = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const TitleLink = styled.a`
  color: #4e95ff;
  text-decoration: none;
  cursor: pointer;
  :hover {
    color: #74abff;
    text-decoration: underline;
  }
  font-family: Helvetica Neue;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
`;

const CloseButton = styled.div`
  color: #fff;
  :hover {
    color: #5765f2;
  }
  cursor: pointer;
`;

const FixedModal = ({ content, open, onOpenChange, toggle }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Trigger asChild>{toggle}</Dialog.Trigger>
    <Dialog.Overlay asChild>
      <OverlayContainer>
        <Dialog.Content asChild>
          <PopupContainer>{content}</PopupContainer>
        </Dialog.Content>
      </OverlayContainer>
    </Dialog.Overlay>
  </Dialog.Root>
);

const { title, imgSrc, toggle } = props;

const [isOpen, setIsOpen] = useState(false);

const handleClosePopup = () => {
  setIsOpen(false);
};

const onOpenChange = (isOpen) => {
  setIsOpen(isOpen);
};

const popupContent = (
  <>
    <TopBar>
      <TitleLink href={imgSrc} target="_blank">
        {title}
      </TitleLink>
      <CloseButton onClick={handleClosePopup}>
        <i className="bi bi-x-lg"></i>
      </CloseButton>
    </TopBar>
    <FullScreenImage src={imgSrc} alt="A meaningful description" />
  </>
);

return (
  <FixedModal
    toggle={toggle}
    content={popupContent}
    open={isOpen}
    onOpenChange={onOpenChange}
  />
);
