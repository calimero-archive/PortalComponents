const channelName = props.channelName;
const initialTabIndex = props.selectedTabIndex ? 0 : 1;
const onSwitch = props.onSwitch;
const userCount = props.userList.length;
const userList = props.userList;
const componentOwnerId = props.componentOwnerId;
const channelMeta = props.channelMeta;
const handleLeaveChannel = props.handleLeaveChannel;
const addMember = props.addMember;
const promoteModerator = props.promoteModerator;
const removeUserFromChannel = props.removeUserFromChannel;
const curbApi = props.curbApi;

const [selectedTabIndex, setSelectedTabIndex] = useState(initialTabIndex);
const [optionsOpen, setOptionsOpen] = useState(-1);
const [nonInvitedUserList, setNonInvitedUserList] = useState([]);

const getNonInvitedUsers = useCallback(
  (namePrefix, channelName) => {
    if (namePrefix) {
      curbApi.getFilteredMembers(namePrefix, channelName).then((users) => {
        setNonInvitedUserList(users ?? []);
      });
    }
  },
  [curbApi, userList]
);

const ChannelTitle = styled.div`
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

const ChannelName = () => {
  return (
    <ChannelTitle>
      <i className="bi bi-hash"></i>
      {channelName}
    </ChannelTitle>
  );
};

return (
  <>
    <ChannelName channelName={channelName} />
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.Settings.TabSwitch`}
      props={{
        selectedTabIndex,
        setSelectedTabIndex,
        userCount,
      }}
    />
    {selectedTabIndex === 0 && (
      <Widget
        src={`${componentOwnerId}/widget/Calimero.Curb.Settings.AboutDetails`}
        props={{
          dateCreated: channelMeta.createdAt,
          manager: channelMeta.createdBy,
          handleLeaveChannel,
        }}
      />
    )}
    {selectedTabIndex === 1 && (
      <Widget
        src={`${componentOwnerId}/widget/Calimero.Curb.Settings.MemberDetails`}
        props={{
          componentOwnerId,
          userList,
          addMember,
          channelName,
          setOptionsOpen,
          optionsOpen,
          promoteModerator,
          removeUserFromChannel,
          channelOwner: channelMeta.createdBy,
          getNonInvitedUsers,
          nonInvitedUserList,
        }}
      />
    )}
  </>
);
