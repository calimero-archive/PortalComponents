const {
  componentOwnerId,
  communities,
  handleContractChange,
  selectedCommunity,
} = props;

const SelectTrigger = styled("Select.Trigger")`
  display: flex;
  align-items: center;
  width: 293px;
  height: 63px;
  padding: 16px;
  border-radius: 4px;
  gap: 16px;
  background-color: #1e1f28;
  font-family: Helvetica Neue;
  font-weight: 400;
  border: none;
  :focus {
    outline-width: 0px;
  }
  :hover {
    background-color: #2e2e2e;
  }
  ${({ isOpen }) =>
    isOpen ? "border-radius: 4px 4px 0px 0px;" : "border-radius: 4px;"}
  @media (max-width: 1024px) {
    width: 350px;
  }
`;

const SelectContent = styled("Select.Content")`
  display: flex;
  flex-direction: column;
  background-color: #1e1f28;
  gap: 16px;
  z-index: 20;
  border-radius: 0px 0px 4px 4px;
  cursor: pointer;
  width: 293px;
  @media (max-width: 1024px) {
    width: 350px;
  }
`;

const SelectItem = styled("Select.Item")`
  display: flex;
  align-items: center;
  width: 293px;
  height: 63px;
  padding: 16px;
  border-radius: 4px;
  gap: 16px;
  background-color: #1e1f28;
  font-family: Helvetica Neue;
  font-weight: 400;
  border: none;
  :focus {
    outline-width: 0px;
  }
  :hover {
    background-color: #2e2e2e;
  }
  @media (max-width: 1024px) {
    width: 350px;
  }
`;

const SelectIcon = styled("Select.Icon")`
  color: #fff;
  transition: transform 3s ease-in-out;
  transform: rotate(${({ isOpen }) => (isOpen ? "180deg" : "0deg")});
`;

const CommunityInfo = styled.div`
  display: flex;
  column-gap: 8px;
  width: 220px;
  @media (max-width: 1024px) {
    width: 270px;
  }
`;

const CommunityDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommunityName = styled.p`
  padding: 0;
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
  color: #fff;
`;

const CommunityMembersCount = styled.p`
  padding: 0;
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
  color: #777583;
`;

const Text = styled.p`
  padding: 0;
  margin: 0;
`;

const CommunityLogoContainer = styled.div`
  position: relative;
  width: 43px;
  height: 43px;
`;

const NotificationsStatusCricle = styled.div`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: #ff3a3a;
`;

const CommunityLogo = styled.div`
  width: 42px;
  height: 42px;
`;

const [community, setCommunity] = useState(
  communities.find((x) => x.contract === selectedCommunity)
);
const [isOpen, setIsOpen] = useState(false);

const toggleOpen = () => {
  setIsOpen((prevIsOpen) => !prevIsOpen);
};

const handleCommunityChange = (community) => {
  handleContractChange(community.contract);
  setCommunity(community);
};

return (
  <Select.Root
    value={community}
    onValueChange={handleCommunityChange}
    open={isOpen}
    onOpenChange={toggleOpen}
  >
    <SelectTrigger isOpen={isOpen}>
      <Select.Value value={community}>
        <CommunityInfo>
          {community.assets?.logo && (
            <CommunityLogoContainer>
              <CommunityLogo>
                <img
                  src={`https://ipfs.near.social/ipfs/${community.assets.logo}`}
                  alt="uploaded"
                />
              </CommunityLogo>
              {community.notifications?.length > 0 && (
                <NotificationsStatusCricle />
              )}
            </CommunityLogoContainer>
          )}
          <CommunityDetails>
            <CommunityName>{community.name}</CommunityName>
            <CommunityMembersCount>{`${community.members} members`}</CommunityMembersCount>
          </CommunityDetails>
        </CommunityInfo>
      </Select.Value>
      <SelectIcon isOpen={isOpen}>
        <i className="bi bi-chevron-down"></i>
      </SelectIcon>
    </SelectTrigger>
    <SelectContent position="popper">
      <Select.Viewport>
        <Select.Group>
          {communities?.map((community, id) => (
            <SelectItem id={id} key={id} value={community} ref="forwardedRef">
              <CommunityInfo>
                {community.assets?.logo && (
                  <CommunityLogoContainer>
                    <CommunityLogo>
                      <img
                        src={`https://ipfs.near.social/ipfs/${community.assets.logo}`}
                        alt="uploaded"
                      />
                    </CommunityLogo>
                    {community.notifications?.length > 0 && (
                      <NotificationsStatusCricle />
                    )}
                  </CommunityLogoContainer>
                )}
                <CommunityDetails>
                  <CommunityName>{community.name}</CommunityName>
                  <CommunityMembersCount>{`${community.members} members`}</CommunityMembersCount>
                </CommunityDetails>
              </CommunityInfo>
            </SelectItem>
          ))}
        </Select.Group>
      </Select.Viewport>
    </SelectContent>
  </Select.Root>
);
