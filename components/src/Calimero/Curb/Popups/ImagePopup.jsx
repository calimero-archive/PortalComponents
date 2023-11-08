const OverlayContainer = styled.div`
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 50;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  @media (max-width: 1024px) {
    height: 100%;
  }
`;

const PopupContainer = styled.div`
  position: absolute;
  overflow: hidden;
  justify-content: center;
  padding: 1rem;
  align-items: center;
`;

const CloseButton = styled.div`
  position: absolute;
  z-index: 50;
  top: 120px;
  right: 120px;
  color: #fff;
  cursor: pointer;
  :hover {
    color: #5765f2;
  }
  @media (max-width: 1024px) {
    top: 100px;
    right: 20px;
  }
`;

const FullScreenImage = styled.img`
  transform: scale(1);
  transition: transform 0.2s ease-in-out;
  overflow: scroll;
  max-height: 500px;
  max-width: 790px;
  @media (max-width: 1024px) {
    max-height: 320px;
    max-width: 320px;
  }
`;

const OptionsContainer = styled.div`
  margin-top: 10px;
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  left: 0;
  bottom: 0;
  @media (max-width: 1024px) {
    position: fixed;
    padding-left: 10px;
    padding-right: 10px;
    bottom: 10px;
    width: 100%;
  }
`;

const Wrapper = styled.div`
  .SliderRoot {
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    touch-action: none;
    width: 100px;
    height: 20px;
  }

  .SliderTrack {
    background-color: rgba(255, 255, 255, 0.5);
    position: relative;
    flex-grow: 1;
    border-radius: 9999px;
    height: 2px;
  }

  .SliderRange {
    position: absolute;
    border-radius: 9999px;
    height: 100%;
  }

  .SliderThumb {
    display: block;
    width: 20px;
    height: 20px;
    background-color: #4e95ff;
    border-radius: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid #fff;
  color: #fff;
`;

const FullScreenImageContainer = styled.div`
  max-height: 790px;
  max-width: 790px;
  overflow: auto;
  @media (max-width: 1024px) {
    max-height: 320px;
    max-width: 320px;
  }
`;

return (
  <OverlayContainer>
    <CloseButton onClick={props.handleClosePopup}>
      <i className="bi bi-x-lg"></i>
    </CloseButton>
    <PopupContainer>
      <FullScreenImageContainer>
        <FullScreenImage src={props.imageSrc} />
      </FullScreenImageContainer>
    </PopupContainer>
  </OverlayContainer>
);
