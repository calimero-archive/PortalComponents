const OverlayContainer = styled.div`
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  position: fixed;
  z-index: 20;
  display: flex;
  background-color: #0e0e10;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;zz
  text: center;
`;

const LoadingHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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

setTimeout(() => {
  console.log("autorefresh");
  props.refresh();
}, 3000);

return (
  <OverlayContainer>
    <PopupContainer>
      <LoadingContainer>
        <LoadingHeader>
          {props.logo}
          <Text>Loading...</Text>
        </LoadingHeader>
      </LoadingContainer>
    </PopupContainer>
  </OverlayContainer>
);
