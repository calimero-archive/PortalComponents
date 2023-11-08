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

const LoginHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text: center;
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
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
      font-size: 18px;
    }
`;

return (
  <OverlayContainer>
    <PopupContainer>
      <LoginHeader>
        <LoginContainer>
          {props.logo}
          <Text>Please login to continue!</Text>
        </LoginContainer>
      </LoginHeader>
    </PopupContainer>
  </OverlayContainer>
);
