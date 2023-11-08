const curbApi = props.curbApi;
const componentOwnerId = props.componentOwnerId;
const onChatSelected = props.onChatSelected;
const activeChat = props.activeChat;
const isSidebarOpen = props.isSidebarOpen;
const setIsSidebarOpen = props.setIsSidebarOpen;
const isWsConnectionActive = props.isWsConnectionActive;
const wsApi = props.wsApi;
const enableCommunities = props.enableCommunities;
const handleContractChange = props.handleContractChange;
const selectedCommunity = props.selectedCommunity;

const communitiesList = props.communities;

const [channels, setChannels] = useState([]);
const [users, setUsers] = useState([]);
const [communities, setCommunities] = useState([]);
const [cachedUsers, setCachedUsers] = useState([]);

const usersRef = useRef(cachedUsers);

const generator = () =>
  Promise.all([
    curbApi.getChannels(),
    curbApi.getUnreadMessages(),
    ...(enableCommunities ? [curbApi.getCommunities(communitiesList)] : []),
  ]);

const [cachedChannels, cachedUnread, cachedCommunities] = useCache(
  generator,
  "channel_container",
  { subscribe: true }
);

useEffect(() => {
  usersRef.current = cachedUsers;
}, [cachedUsers]);

const peerStatusChangeCb = (newStatus) => (event) => {
  const updateUserStatus = (userId, isActive) => {
    const user = usersRef.current.find((u) => u.id === userId);
    if (!user || user.active === newStatus) return;

    const updatedUsers = usersRef.current.map((u) =>
      u.id === userId ? { ...u, active: isActive } : u
    );
    setCachedUsers(updatedUsers);
  };

  const { account_id: accountId } = event;
  updateUserStatus(accountId, newStatus === "online");
};

useEffect(() => {
  const peerConnectedCb = peerStatusChangeCb("online");
  const peerDisconnectedCb = peerStatusChangeCb("offline");
  const channelMessageCb = (event) => {
    if (event.receiver.type === "account") {
      const senderId = event.sender;
      const senderExists = usersRef.current.some((u) => u.id === senderId);
      if (!senderExists) {
        const newUser = {
          id: senderId,
          active: true, // we just received a message from this user, so they are online
          type: "direct_message",
        };
        setCachedUsers((prevUsers) => [...prevUsers, newUser]);
      }
    }
  };

  wsApi.notifications.on("PeerConnected", peerConnectedCb);
  wsApi.notifications.on("PeerDisconnected", peerDisconnectedCb);
  wsApi.notifications.on("ChannelMessage", channelMessageCb);
  return () => {
    wsApi.notifications.off("PeerConnected", peerConnectedCb);
    wsApi.notification.off("PeerDisconnected", peerDisconnectedCb);
    wsApi.notifications.off("ChannelMessage", channelMessageCb);
  };
}, []);

useEffect(() => {
  if (isWsConnectionActive) {
    curbApi
      .getDMs()
      .then((accounts) => curbApi.getAccountsStatus(accounts))
      .then((result) =>
        Object.entries(result.status).map(([accountId, status]) => ({
          id: accountId,
          active: status === "online",
          type: "direct_message",
        }))
      )
      .then((users) => {
        setCachedUsers(users);
      });
  }
}, [isWsConnectionActive]);

useEffect(() => {
  const usersWN = (cachedUsers ?? []).map((u) => ({
    ...u,
    unreadMessages: cachedUnread.chats[u.id] || 0,
  }));

  const channelsWN = (cachedChannels ?? []).map((c) => ({
    ...c,
    unreadMessages: cachedUnread.channels[c.name] || 0,
  }));

  setUsers(usersWN);
  setChannels(channelsWN);
  enableCommunities && setCommunities(cachedCommunities);
}, [cachedUsers, cachedChannels, cachedUnread, cachedCommunities]);

const selectChannel = useCallback(
  (chatSelected) => {
    const chat = { type: chatSelected.type };
    if (chatSelected.type === "channel") {
      chat.name = chatSelected.name;
      chat.readOnly = chatSelected.readOnly;
    } else {
      // we add a new DM, it will need to fetch the status of the other user
      if (!users.some((user) => user.id === chatSelected.id)) {
        setCachedUsers((prevUsers) => [...prevUsers, chatSelected]);
      }
      chat.id = chatSelected.id;
    }
    onChatSelected(chat);
  },
  [users]
);

return (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Curb.SideSelector.SideSelector`}
    props={{
      curbApi,
      componentOwnerId,
      onChatSelected: selectChannel,
      activeChat,
      users,
      channels,
      isSidebarOpen,
      setIsSidebarOpen,
      communities,
      enableCommunities,
      handleContractChange,
      selectedCommunity,
    }}
  />
);
