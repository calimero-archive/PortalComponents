const componentOwnerId = props.componentOwnerId;
const users = props.users;
const onDMSelected = props.onDMSelected;
const selectedDM = props.selectedDM;
const curbApi = props.curbApi;
const createDM = props.createDM;

const [directMessagesOpen, setDirectMessagesOpen] = useState(true);

const DMContainer = styled.div`
  background-color: #0e0e10;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

return (
  <DMContainer>
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.SideSelector.DMHeader`}
      props={{
        componentOwnerId,
        curbApi,
        createDM: props.createDM,
      }}
    />
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.SideSelector.UserList`}
      props={{
        componentOwnerId,
        users,
        onDMSelected,
        selectedDM,
      }}
    />
  </DMContainer>
);
