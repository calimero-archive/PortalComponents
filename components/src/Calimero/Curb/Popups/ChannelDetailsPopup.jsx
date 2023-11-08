const componentOwnerId = props.componentOwnerId;
const chat = props.chat;
const curbApi = props.curbApi;
const toggle = props.toggle;
const initialTab = props.aboutSelected ?? true;

const [isOpen, setIsOpen] = useState(false);
const [channelMeta, setChannelMeta] = useState({});
const [channelUserList, setChannelUserList] = useState([]);

useEffect(() => {
  curbApi.getChannelMeta(chat.name).then(setChannelMeta);
}, []);

const generator = () => curbApi.getChannelMembers(chat.name);
const cachedMembers = useCache(generator, "channel_members", {
  subscribe: true,
});

useEffect(() => {
  if (cachedMembers) {
    setChannelUserList(cachedMembers);
  }
}, [cachedMembers]);

const popupContent = (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Curb.Settings.DetailsContainer`}
    props={{
      componentOwnerId,
      channelName: chat.type === "channel" ? chat.name : chat.id,
      aboutSelected,
      onSwitch: () => setAboutSelected(!aboutSelected),
      channelMeta,
      handleLeaveChannel: () => curbApi.leaveChannel(chat.name),
      userList: channelUserList,
      addMember: curbApi.inviteUser,
      promoteModerator: (accountId, isMod) =>
        curbApi.promoteModerator(accountId, chat.name, isMod),
      removeUserFromChannel: (accountId) =>
        curbApi.removeUserFromChannel(accountId, chat.name),
      curbApi,
    }}
  />
);

const BaseModal = (props) => (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Common.Popups.BaseModal`}
    props={{
      ...props,
      componentOwnerId,
    }}
  />
);

return (
  <BaseModal
    toggle={toggle}
    content={popupContent}
    open={isOpen}
    onOpenChange={setIsOpen}
  />
);
