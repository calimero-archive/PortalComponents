const community = props.community;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 16px 24px 16px;
  border-radius: 4px;
  gap: 4px;
  font-family: Helvetica Neue;
  letter-spacing: 0em;
  background-color: #1d1d21;
  :hover {
    background-color: #2e2e32;
  }
  cursor: pointer;
`;

const CommunityLogo = styled.img`
  width: 42px;
  height: 42px;
  top: 24px;
  left: 104.5px;
  border-radius: 50%;
`;

const CommunityName = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  padding: 0;
  margin: 0;
  color: #fff;
`;

const CommunityDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  padding: 0;
  margin: 0;
  color: #6b7280;
  text-align: center;
`;

return (
  <Container>
    <CommunityLogo src={community.logo} />
    <CommunityName>{community.name}</CommunityName>
    <CommunityDescription>{community.description}</CommunityDescription>
  </Container>
);
