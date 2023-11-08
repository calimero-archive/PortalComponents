const activeChat = props.activeChat;
const componentOwnerId = props.componentOwnerId;
const curbApi = props.curbApi;

const generator = () => curbApi.getChannelMembers(activeChat.name);
const cachedMembers = useCache(generator, "channel_members", {
  subscribe: true,
});

const [members, setMembers] = useState([]);

useEffect(() => {
  if (cachedMembers) {
    setMembers(cachedMembers);
  }
}, [cachedMembers]);

return (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Curb.Navbar.CurbNavbar`}
    props={{
      ...props,
      channelUserList: members,
    }}
  />
);
