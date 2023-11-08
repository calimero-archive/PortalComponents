const OverlayContainer = styled.div`
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  position: relative;
  width: 100%;
  height: calc(100vh - 88px);
  z-index: 20;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const PopupContainer = styled.div`
  position: relative;
  background-color: #1d1d21;
  padding: 1rem;
  border-radius: 8px;
  width: 489px;
  @media (max-width: 1024px) {
    width: 90%;
  }
`;

const JoinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;zz
  text: center;
`;

const JoinHeader = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 1rem;
  padding-top: 0.5rem;
`;

const Text = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%
  margin-bottom: 1rem;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
`;

const FunctionButton = styled.button`
  background-color: #5765f2;
  :hover {
    background-color: #717cf0;
  }
  color: #fff;
  border-radius: 4px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: none;
  width: 100%;
`;

return (
  <OverlayContainer>
    <PopupContainer>
      <JoinContainer>
        <JoinHeader>
          {props.logo}
          <Text>Join Chat to view channels!</Text>
          <div className="pt-3" />
          <FunctionButton onClick={props.refresh}>Join</FunctionButton>
        </JoinHeader>
      </JoinContainer>
    </PopupContainer>
  </OverlayContainer>
);
