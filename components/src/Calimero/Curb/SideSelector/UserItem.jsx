const UserListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #777583;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.5rem;
  :hover {
    color: #ffffff;
  }
  :hover {
    background-color: #25252a;
  }
  cursor: pointer;
  ${({ selected }) =>
    selected
      ? "color: #fff; background-color: #25252a;"
      : "color: #777583; background-color: #0E0E10;"}
`;

const UserInfoContainer = styled.div`
  display: flex;
  column-gap: 0.5rem;
`;

const NameContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
`;

const handleClick = useCallback(() => {
  props.onDMSelected(user);
}, [user, props.onDMSelected]);

const user = props.user;
return (
  <UserListItem selected={props.selected} onClick={handleClick}>
    <UserInfoContainer>
      <Widget
        src={`${props.componentOwnerId}/widget/Calimero.Curb.ProfileIcon.UserProfileIcon`}
        props={{
          accountId: user.id,
          active: user.active,
          componentOwnerId: props.componentOwnerId,
        }}
      />
      <NameContainer>{`${user.id}`}</NameContainer>
    </UserInfoContainer>
    {user.unreadMessages.count > 0 && (
      <Widget
        src={`${props.componentOwnerId}/widget/Calimero.Curb.SideSelector.UnreadMessagesBadge`}
        props={{
          messageCount: user.unreadMessages.count,
          backgroundColor: "#777583",
        }}
      />
    )}
  </UserListItem>
);
