const activeChat = props.activeChat;
const componentOwnerId = props.componentOwnerId;
const curbApi = props.curbApi;

const DropdownSelector = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  padding-left: 0.875rem;
  padding-top: 0.5rem;
`;

const SelectedChannelName = styled.h4`
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  @media (max-width: 1024px) {
    font-size: 18px;
    font-weight: 400;
  }
`;

const ChevronIcon = styled.i`
  font-size: 1rem;
  @media (max-width: 1024px) {
    display: none;
  }
  cursor: pointer;
  color: #777583;
`;

const MobileCogIcon = styled.i`
  display: none;
  @media (max-width: 1024px) {
    display: block;
  }
  cursor: pointer;
  color: #777583;
  font-size: 0.8rem;
  padding-bottom: 4px;
`;

if (activeChat.type === "channel") {
  const toggle = (
    <DropdownSelector>
      <SelectedChannelName>{activeChat.name}</SelectedChannelName>
      <>
        <ChevronIcon className="bi bi-gear-fill" />
        <MobileCogIcon className="bi bi-info-circle-fill" />
      </>
    </DropdownSelector>
  );
  return (
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.Popups.ChannelDetailsPopup`}
      props={{
        toggle,
        chat: activeChat,
        curbApi,
        componentOwnerId,
      }}
    />
  );
}
const title =
  activeChat.type === "direct_message" ? activeChat.id : activeChat.name;
return <SelectedChannelName>{title}</SelectedChannelName>;
