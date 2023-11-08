const communities = props.communities;
const filteredCommunities = props.filteredCommunities;
const isSearched = props.isSearched;
const componentOwnerId = props.componentOwnerId;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommunitiesContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  gap: 16px;
  ${({ isSearched }) => isSearched && "padding: 0px 24px 0px 24px;"}
`;

const SearchBox = styled.input`
  width: 347px;
  padding: 6px 12px 6px 12px;
  border-radius: 4px 0px 0px 4px;
  background-color: #37373f;
  color: #6c757d;
  border: none;
  :focus {
    border-color: #d0fc42;
    border-style: solid;
    border-width: 0.1px;
    outline-width: 0px;
  }
`;

const SearchButton = styled.button`
  display: flex;
  column-gap: 8px;
  justify-content: center;
  align-items: center;
  background-color: #d0fc42;
  color: #212529;
  width: 99px;
  padding: 6px 12px 6px 12px;
  border-radius: 0px 4px 4px 0px;
  border: none;
  :hover {
    background-color: #bbe33b;
  }
`;

const Title = styled.h4`
  color: #fff;
  text-align: left;
`;

return (
  <Container>
    {!isSearched && <Title>Community list</Title>}
    <CommunitiesContainer isSearched={isSearched}>
      {isSearched
        ? filteredCommunities.map((community) => (
            <Widget
              key={community.id}
              src={`${componentOwnerId}/widget/Calimero.Curb.Communities.CommunityCard`}
              props={{
                community,
              }}
            />
          ))
        : communities.map((community) => (
            <Widget
              key={community.id}
              src={`${componentOwnerId}/widget/Calimero.Curb.Communities.CommunityCard`}
              props={{
                community,
              }}
            />
          ))}
    </CommunitiesContainer>
  </Container>
);
