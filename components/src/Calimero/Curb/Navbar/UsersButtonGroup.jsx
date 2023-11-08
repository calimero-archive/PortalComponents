const AvatarContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  flex-direction: row;
  cursor: pointer;
`;

const ProfileIconContainerGroup = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  ${({ id }) => id && `background-color: ${colors[id]};`}
  ${({ counter }) =>
    counter ? "background-color: #25252A; color: #6E6E78;" : "color: #FFF;"}
    text-align: center;
  /* Body/Small */
  font-family: Helvetica Neue;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 21px */
  margin-left: -8px;
  border: solid 1px #0e0e10;
  :hover {
    border: solid 1px #fff;
  }
`;

return (
  <AvatarContainer onClick={props.openMemberList}>
    {props.channelUserList.slice(0, 3).map((user, id) => {
      return (
        <div key={id}>
          <ProfileIconContainerGroup>
            <Widget
              src={`${props.componentOwnerId}/widget/Calimero.Curb.ProfileIcon.UserProfileIcon`}
              props={{
                accountId: user.id,
                showStatus: false,
                componentOwnerId: props.componentOwnerId,
              }}
            />
          </ProfileIconContainerGroup>
        </div>
      );
    })}
    {props.channelUserList.length > 3 && (
      <ProfileIconContainerGroup counter={true}>
        {props.channelUserList.length}
      </ProfileIconContainerGroup>
    )}
  </AvatarContainer>
);
