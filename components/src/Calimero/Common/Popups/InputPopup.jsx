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
  border-radius: 4px;
  background-color: #0e0e10;
  border: none;
`;

const customStyle = {
  border: "1px solid #dc3545",
  outline: "none",
};

const FunctionButton = styled.button`
  background-color: ${({ disabled }) =>
    disabled ? `${colors.disabled};` : `${colors.base};`};
  :hover {
    background-color: ${({ disabled }) =>
      disabled ? `${colors.disabled};` : `${colors.hover};`};
  }
  color: #fff;
  border-radius: 4px;
  margin-top: 4px;
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

const UserList = styled.div`
  position: absolute;
  left: 0px;
  top: 7rem;
  overflow-y: scroll;
  max-height: 150px;
  width: 100%;
  background-color: #1d1d21;
  border-radius: 4px;
  padding: 8px;
  scrollbar-color: black black;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: black;
    border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: black;
  }
  * {
    scrollbar-color: black black;
  }
  html::-webkit-scrollbar {
    width: 12px;
  }
  html::-webkit-scrollbar-thumb {
    background-color: black;
    border-radius: 6px;
  }
  html::-webkit-scrollbar-thumb:hover {
    background-color: black;
  }
`;

const UserListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #777583;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  :hover {
    background-color: #25252a;
  }
`;

const UserInfo = styled.div`
  display: flex;
  column-gap: 0.5rem;
`;

const UserText = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
`;

const ErrorWrapper = styled.div`
  color: #dc3545;
  /* Body/Small */
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 21px */
  margin-top: 6px;
`;

const RulesWrapper = styled.div`
  color: #6c757d;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 21px */
  margin-top: 6px;
`;

const EmptyMessageContainer = styled.div`
  height: 27px;
`;

const IconSvg = styled.svg`
  position: absolute;
  top: 50%;
  right: 13px;
`;

const ExclamationIcon = () => (
  <IconSvg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="#dc3545"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.99951 2.74918C5.54773 2.74918 2.74951 5.5474 2.74951 8.99918C2.74951 12.451 5.54773 15.2492 8.99951 15.2492C12.4513 15.2492 15.2495 12.451 15.2495 8.99918C15.2495 5.5474 12.4513 2.74918 8.99951 2.74918ZM1.74951 8.99918C1.74951 4.99511 4.99545 1.74918 8.99951 1.74918C13.0036 1.74918 16.2495 4.99511 16.2495 8.99918C16.2495 13.0032 13.0036 16.2492 8.99951 16.2492C4.99545 16.2492 1.74951 13.0032 1.74951 8.99918ZM8.334 5.058C8.42856 4.95669 8.56093 4.89918 8.69951 4.89918H9.29951C9.4381 4.89918 9.57046 4.95669 9.66503 5.058C9.75959 5.15931 9.80786 5.29532 9.79833 5.43358L9.49833 9.78358C9.48025 10.0457 9.2623 10.2492 8.99951 10.2492C8.73672 10.2492 8.51878 10.0457 8.5007 9.78358L8.2007 5.43358C8.19116 5.29532 8.23944 5.15931 8.334 5.058ZM9.89951 12.2992C9.89951 12.7962 9.49657 13.1992 8.99951 13.1992C8.50246 13.1992 8.09951 12.7962 8.09951 12.2992C8.09951 11.8021 8.50246 11.3992 8.99951 11.3992C9.49657 11.3992 9.89951 11.8021 9.89951 12.2992Z"
      fill="#DC3545"
    />
  </IconSvg>
);

const InputWrapper = styled.div`
  position: relative;
`;

const {
  title,
  toggle,
  placeholder,
  functionLoader,
  buttonText,
  componentOwnerId,
  validator,
  colors,
  isChild,
  autocomplete,
  nonInvitedUserList,
} = props;

const BaseModal = (props) => (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Common.Popups.BaseModal`}
    props={{
      ...props,
      componentOwnerId,
    }}
  />
);

const [isOpen, setIsOpen] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const [inputValue, setInputValue] = useState("");
const [validInput, setValidInput] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [chatUsersNotInMembers, setChatUsersNotInMembers] = useState([]);
const [showAutocomplete, setShowAutocomplete] = useState(false);

const runProcess = () => {
  setIsProcessing(true);
  functionLoader(inputValue).then((receipt) => {
    if (receipt === undefined) {
      setValidInput(false);
      setErrorMessage("This user does not exist.");
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
      setIsOpen(false);
    }
  });
};

const onOpenChange = (isOpen) => {
  if (isProcessing && !isOpen) {
    return;
  }
  setIsOpen(isOpen);
};

const handleClosePopup = () => {
  if (isProcessing) return;
  setIsOpen(false);
};

const isInvalid = inputValue && validator && !validInput && errorMessage;

const AutocompleteContainer = ({ value, inviteUsers, selectUser }) => {
  return (
    <>
      {inviteUsers.length && (
        <UserList>
          {inviteUsers.map(
            (user, id) =>
              user.id !== value && (
                <UserListItem key={id} onClick={() => selectUser(user.id)}>
                  <UserInfo>
                    <Widget
                      src={`${componentOwnerId}/widget/Calimero.Curb.ProfileIcon.UserProfileIcon`}
                      props={{
                        accountId: user.id,
                        active: user.active,
                        componentOwnerId,
                      }}
                    />
                    <UserText>{user.id}</UserText>
                  </UserInfo>
                </UserListItem>
              )
          )}
        </UserList>
      )}
    </>
  );
};

const selectUser = (userId) => {
  setInputValue(userId);
  setValidInput(validator(userId));
  setShowAutocomplete(false);
};

const popupContent = (
  <>
    <CloseButton onClick={handleClosePopup}>
      <i className="bi bi-x-lg"></i>
    </CloseButton>
    <Text>{title}</Text>
    <InputWrapper>
      <Input
        onChange={(e) => {
          setInputValue(e.target.value);
          if (validator) {
            const { isValid, error } = validator(e.target.value);
            setValidInput(isValid);
            setErrorMessage(error ? error : "");
          }
          if (e.target.value) {
            setShowAutocomplete(true);
          } else {
            setShowAutocomplete(false);
          }
        }}
        value={inputValue}
        placeholder={placeholder}
        style={isInvalid ? customStyle : {}}
      />
      {isInvalid && <ExclamationIcon />}
    </InputWrapper>
    {isInvalid && errorMessage ? (
      <ErrorWrapper>{errorMessage}</ErrorWrapper>
    ) : (
      <RulesWrapper>
        Invite users whose wallets end with '.near' for access
      </RulesWrapper>
    )}
    {autocomplete &&
      inputValue &&
      nonInvitedUserList.length > 0 &&
      showAutocomplete && (
        <AutocompleteContainer
          value={inputValue}
          inviteUsers={nonInvitedUserList}
          selectUser={selectUser}
        />
      )}
    <FunctionButton
      onClick={runProcess}
      disabled={inputValue ? isInvalid : true}
    >
      {isProcessing ? (
        <Widget
          src={`${componentOwnerId}/widget/Calimero.Curb.Loader.Loader`}
          props={{ size: 16 }}
        />
      ) : (
        buttonText
      )}
    </FunctionButton>
  </>
);

return (
  <BaseModal
    toggle={toggle}
    content={popupContent}
    open={isOpen}
    onOpenChange={onOpenChange}
    isChild={isChild}
  />
);
