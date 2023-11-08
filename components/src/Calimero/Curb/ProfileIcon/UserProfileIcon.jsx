const ProfileIconContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ width }) => width && `width: ${width};`}
  ${({ height }) => height && `height: ${width};`}
`;

const ActiveStatusCricle = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  ${({ active }) =>
    active ? "background-color: #00FF66;" : "background-color: #777583;"}
  border: 1px solid #1A1A1D;
`;
const accountId = props.accountId;
const showStatus = props.showStatus ?? true;
const width = props.width ?? "24px";
const height = props.height ?? "24px";
const componentOwnerId = props.componentOwnerId;

return (
  <ProfileIconContainer width={width} height={height}>
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.ProfileIcon.Image`}
      props={{
        accountId,
        alt: `profile-icon-${accountId}`,
        className: "rounded-circle",
        style: { width: width, height: height, objectFit: "cover" },
        thumbnail: "thumbnail",
        fallbackUrl: "https://i.imgur.com/e8buxpa.png",
        componentOwnerId: componentOwnerId,
      }}
    />
    {showStatus && <ActiveStatusCricle active={props.active} />}
  </ProfileIconContainer>
);
