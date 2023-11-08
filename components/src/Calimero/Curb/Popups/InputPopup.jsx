const OverlayContainer = styled.div`
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  position: absolute;
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
`;

const Input = styled.input`
  color: #fff;
  width: 100%;
  height: 40px;
  padding: 8px 60px 8px 16px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #0e0e10;
  border: none;
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

const CloseButton = styled.div`
  color: #fff;
  :hover {
    color: #5765f2;
  }
  position: absolute;
  right: 1rem;
  cursor: pointer;
`;
const [inputValue, setInputValue] = useState("");

const handleInputChange = useCallback((e) => {
  setInputValue(e.target.value);
}, []);
const handleSubmit = () => {
  props.handleClickEvent(inputValue);
};
return (
  <OverlayContainer>
    <PopupContainer>
      <CloseButton onClick={props.handleClosePopup}>
        <i className="bi bi-x-lg"></i>
      </CloseButton>
      <Text>{props.title}</Text>
      <Input onChange={handleInputChange} placeholder={props.placeholder} />
      <FunctionButton onClick={handleSubmit}>
        {props.functionLoader ? (
          <Widget
            src={`${props.componentOwnerId}/widget/Calimero.Curb.Loader.Loader`}
            props={{ size: 16 }}
          />
        ) : (
          props.buttonText
        )}
      </FunctionButton>
    </PopupContainer>
  </OverlayContainer>
);
