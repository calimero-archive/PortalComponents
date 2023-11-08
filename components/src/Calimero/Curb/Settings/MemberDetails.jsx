const componentOwnerId = props.componentOwnerId;
const userList = props.userList;
const addMember = props.addMember;
const channelName = props.channelName;
const chatUsers = props.chatUsers;
const setOptionsOpen = props.setOptionsOpen;
const optionsOpen = props.optionsOpen;
const promoteModerator = props.promoteModerator;
const removeUserFromChannel = props.removeUserFromChannel;
const channelOwner = props.channelOwner;
const getNonInvitedUsers = props.getNonInvitedUsers;

const groupMembers = userList.map((user) => user.id);

const AddMemberButton = styled.div`
  display: flex;
  column-gap: 0.5rem;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  color: #fff;
  :hover {
    background-color: #5765f2;
  }
  border-radius: 4px;
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  cursor: pointer;
`;

const UserListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #777583;
  :hover {
    background-color: #25252a;
  }
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const UserList = styled.div`
  overflow-y: scroll;
  max-height: 24rem;
  @media (max-width: 1024px) {
    max-height: 12rem;
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

const UserInfo = styled.div`
  display: flex;
  column-gap: 0.5rem;
`;

const Text = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
`;

const AddUserDialog = ({
  addMember,
  channelName,
  componentOwnerId,
  getNonInvitedUsers,
  nonInvitedUserList,
}) => {
  const addUser = useCallback(
    (account) => addMember({ account, channel: channelName }),
    [addMember, channelName, channelName]
  );
  const isValidAccountName = useCallback((value) => {
    getNonInvitedUsers(value, channelName);
    const regex = /^[a-z\d]+[-_]*[a-z\d]+[-_]*[a-z\d]+\.(near|testnet)$/;
    let isValid = false;
    let error = "";

    if (!regex.test(value)) {
      isValid = false;
      error = "";
    } else if (groupMembers?.includes(value)) {
      isValid = false;
      error = "User already in channel.";
    } else {
      isValid = true;
      error = "";
    }
    return { isValid, error };
  }, []);

  return (
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Common.Popups.InputPopup`}
      props={{
        componentOwnerId,
        title: `Invite user to #${channelName}`,
        placeholder: "ex: username.near",
        buttonText: "Invite",
        functionLoader: addUser,
        colors: {
          base: "#5765f2",
          hover: "#717cf0",
          disabled: "#3B487A",
        },
        toggle: (
          <AddMemberButton>
            <i className="bi bi-plus-circle-fill" />
            Add new member
          </AddMemberButton>
        ),
        isChild: true,
        validator: isValidAccountName,
        autocomplete: true,
        nonInvitedUserList,
      }}
    />
  );
};

const OptionsButton = ({ handleClick }) => {
  return (
    <svg
      onClick={() => handleClick()}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="white"
      className="bi bi-three-dots"
      viewBox="0 0 16 16"
    >
      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );
};

const OptionsWindowWrapper = styled.div`
  position: absolute;
  right: 22px;
  padding-top: 90px;
  pointer-events: none;
`;

const OptionsWindow = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 0px 0px 4px 4px;
  background-color: #25252a;
  pointer-events: auto;
`;

const Option = styled.div`
  color: #fff;
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 4px;
  padding-bottom: 4px;
  font-weight: 400;
  line-height: 150%;
  -webkit-font-smoothing: antialiased applied;
  cursor: pointer;
  :hover {
    background-color: #2a2b37;
  }
`;

const RoleText = styled.div`
  color: #777583;
  font-family: Helvetica Neue;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
`;

const ModeratorOptions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const isMod = userList?.some(
  (user) => user.id === context.accountId && user.moderator === true
);
const isOwner = context.accountId === channelOwner;

return (
  <>
    <AddUserDialog {...props} />
    <UserList>
      {userList.length &&
        userList.map((user, id) => (
          <UserListItem key={id}>
            <UserInfo>
              <Widget
                src={`${componentOwnerId}/widget/Calimero.Curb.ProfileIcon.UserProfileIcon`}
                props={{
                  accountId: user.id,
                  active: user.active,
                  componentOwnerId,
                }}
              />
              <Text>{user.id}</Text>
            </UserInfo>
            <ModeratorOptions>
              {(user.moderator || channelOwner === user.id) && (
                <RoleText>{`${
                  channelOwner === user.id
                    ? "Channel Owner"
                    : "Channel Moderator"
                }`}</RoleText>
              )}
              {((isMod && !user.moderator && channelOwner !== user.id) ||
                isOwner) && (
                <OptionsButton
                  handleClick={() => {
                    if (optionsOpen === id) {
                      setOptionsOpen(-1);
                    } else {
                      setOptionsOpen(id);
                    }
                  }}
                />
              )}
            </ModeratorOptions>
            {optionsOpen === id && (
              <OptionsWindowWrapper>
                <OptionsWindow>
                  {user.id !== channelOwner && isOwner && (
                    <Option
                      onClick={() => promoteModerator(user.id, !user.moderator)}
                    >{`${
                      user.moderator ? "Remove moderator" : "Make moderator"
                    }`}</Option>
                  )}
                  <Option onClick={() => removeUserFromChannel(user.id)}>
                    Remove from channel
                  </Option>
                </OptionsWindow>
              </OptionsWindowWrapper>
            )}
          </UserListItem>
        ))}
    </UserList>
  </>
);
