const activeChat = props.activeChat;
const componentOwnerId = props.componentOwnerId;
const curbApi = props.curbApi;
const isSidebarOpen = props.isSidebarOpen;
const setIsSidebarOpen = props.setIsSidebarOpen;
const channelSelected = props.channelSelected;
const enableCommunities = props.enableCommunities;

const [appName, setAppName] = useState("");

useEffect(() => {
  curbApi.getAppName().then(setAppName);
}, [curbApi]);

const ChannelNavbarContainer = (props) => {
  return (
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.ChannelNavbarContainer`}
      props={props}
    />
  );
};

const DMNavbarContainer = (props) => {
  return (
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.Navbar.CurbNavbar`}
      props={props}
    />
  );
};

const props = {
  appName,
  activeChat,
  componentOwnerId,
  curbApi,
  isSidebarOpen,
  setIsSidebarOpen,
  channelSelected:
    activeChat.type === "channel" ? activeChat.name : activeChat.id,
  enableCommunities,
};

return (
  <>
    {activeChat.type === "channel" ? (
      <ChannelNavbarContainer {...props} />
    ) : (
      <DMNavbarContainer {...props} />
    )}
  </>
);
