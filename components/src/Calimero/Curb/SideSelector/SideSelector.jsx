const users = props.users;
const channels = props.channels;
const componentOwnerId = props.componentOwnerId;
const activeChat = props.activeChat;
const onChatSelected = props.onChatSelected;
const curbApi = props.curbApi;
const isSidebarOpen = props.isSidebarOpen;
const communities = props.communities;
const enableCommunities = props.enableCommunities;
const handleContractChange = props.handleContractChange;
const selectedCommunity = props.selectedCommunity;

const HorizontalSeparatorLine = styled.div`
  background-color: "#BF4F74";
  height: 1px;
  background-color: #282933;
  margin-top: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const SideMenu = styled.div`
  background-color: #0e0e10;
  padding-top: 1rem;
  width: 318px;
  overflow-y: scroll;
  height: calc(100vh - 169px);
  @media (max-width: 1024px) {
    display: none;
  }
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

const SideMenuMobile = styled.div`
  display: none;
  background-color: #0e0e10;
  padding-top: 1rem;
  overflow-y: scroll;
  height: 100vh;
  @media (max-width: 1024px) {
    display: block;
    position: relative;
    z-index: 10;
    padding-top: 64px;
    width: 100%;
    padding-bottom: 30px;
  }
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

const CommunityDropdownContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
`;

const SideMenuContent = () => {
  return (
    <>
      {enableCommunities && communities && (
        <>
          <CommunityDropdownContainer>
            <Widget
              src={`${componentOwnerId}/widget/Calimero.Curb.Communities.CommunityDropdown`}
              props={{
                componentOwnerId,
                communities,
                handleContractChange,
                selectedCommunity,
              }}
            />
          </CommunityDropdownContainer>
        </>
      )}
      {enableCommunities && communities && <HorizontalSeparatorLine />}
      <Widget
        src={`${componentOwnerId}/widget/Calimero.Curb.SideSelector.ChannelsHeader`}
        props={{
          title: "Channel",
          componentOwnerId,
          curbApi,
        }}
      />
      <Widget
        src={`${props.componentOwnerId}/widget/Calimero.Curb.SideSelector.ChannelList`}
        props={{
          channels,
          selectChannel: onChatSelected,
          selectedChannelId:
            activeChat.type === "channel" ? activeChat.name : null,
          componentOwnerId,
        }}
      />
      <HorizontalSeparatorLine />
      <Widget
        src={`${props.componentOwnerId}/widget/Calimero.Curb.SideSelector.DMSideSelector`}
        props={{
          componentOwnerId,
          curbApi,
          users,
          onDMSelected: onChatSelected,
          selectedDM:
            activeChat.type === "direct_message" ? activeChat.id : null,
          createDM: (value) =>
            new Promise((resolve) => {
              onChatSelected({
                id: value,
                type: "direct_message",
              });
              resolve();
            }),
        }}
      />
    </>
  );
};
return (
  <>
    {isSidebarOpen && (
      <SideMenuMobile>
        <SideMenuContent />
      </SideMenuMobile>
    )}
    <SideMenu>
      <SideMenuContent />
    </SideMenu>
  </>
);
