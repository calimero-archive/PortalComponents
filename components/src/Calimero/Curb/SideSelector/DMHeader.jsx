const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0e0e10;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #777583;
  :hover {
    color: #ffffff;
  }
  @media (max-width: 1024px) {
    width: 100%;
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

const componentOwnerId = props.componentOwnerId;
const curbApi = props.curbApi;
const createDM = props.createDM;

const isValidNearAccount = useCallback((value) => {
  const regex = /^[a-z\d]+[-_]*[a-z\d]+[-_]*[a-z\d]+\.(near|testnet)$/;
  let isValid = false;
  let error = "";

  if (!regex.test(value)) {
    isValid = false;
    error = "Invite users whose wallets end with '.near' for access";
  } else {
    isValid = true;
    error = "";
  }
  return { isValid, error };
}, []);

const CreateDMPopup = ({ componentOwnerId, createDM, curbApi }) => (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Curb.Popups.StartDMPopup`}
    props={{
      componentOwnerId,
      title: "Start new message",
      placeholder: "Send to wallet address",
      buttonText: "Next",
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
      onAccountSelected: createDM,
      fetchAccounts: (prefix) => {
        return curbApi.fetchAccounts({ prefix, limit: 20 });
      },
      validator: isValidNearAccount,
      functionLoader: createDM,
    }}
  />
);

return (
  <Container>
    <TextBold>{"Direct Messages"}</TextBold>
    <CreateDMPopup
      componentOwnerId={props.componentOwnerId}
      createDM={props.createDM}
      curbApi={props.curbApi}
    />
  </Container>
);
