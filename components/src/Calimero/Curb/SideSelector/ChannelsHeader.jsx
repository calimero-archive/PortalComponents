const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0e0e10;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #777583;
  :hover {
    color: #ffffff;
  }
  @media (max-width: 1024px) {
    width: 100%;
    padding-top: 1.25rem;
  }
`;

const TextBold = styled.div`
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`;
const IconPlusContainer = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
`;

const isValidChannelName = useCallback((value) => {
  const regex = /^[^#!\s]{3,19}$/;
  let error = null;
  const isValid = regex.test(value);

  if (value.match(/[!#.\s]/)) {
    error = "Channel name must not contain special charters or links.";
  } else if (value.length < 3) {
    error = "Channel name is too short. It should be at least 3 characters.";
  } else if (value.length > 19) {
    error = "Channel name is too long. It should be at most 19 characters.";
  } else {
    error = "Invalid channel name.";
  }

  return { isValid, error };
}, []);

const CreateChannelPopup = (props) => (
  <Widget
    src={`${props.componentOwnerId}/widget/Calimero.Curb.Popups.CreateChannelPopup`}
    props={{
      componentOwnerId: props.componentOwnerId,
      title: "Create new Channel",
      placeholder: "# channel name",
      buttonText: "Create",
      colors: {
        base: "#5765f2",
        hover: "#717cf0",
        disabled: "#3B487A",
      },
      toggle: (
        <IconPlusContainer>
          <i className="bi bi-plus-circle" />
        </IconPlusContainer>
      ),
      createChannel: (channelName, isPublic, isReadOnly) =>
        props.curbApi.createGroup(channelName, isPublic, isReadOnly, accountId),
      channelNameValidator: isValidChannelName,
    }}
  />
);

return (
  <Container>
    <TextBold>{props.title}</TextBold>
    <CreateChannelPopup
      curbApi={props.curbApi}
      componentOwnerId={props.componentOwnerId}
    />
  </Container>
);
