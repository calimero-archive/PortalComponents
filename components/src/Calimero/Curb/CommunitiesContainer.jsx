const componentOwnerId = props.componentOwnerId;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: black;
  padding: 31px 60px 31px 31px;
  gap: 43px;
`;

const [communities, setCommunities] = useState([]);
const [filteredCommunities, setFilteredCommunities] = useState([]);
const [isSearched, setIsSearched] = useState(false);
const [searchedTerm, setSearchedTerm] = useState("");

const handleSearch = useCallback(
  (searchTerm) => {
    const filtered = communities.filter((community) =>
      community.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredCommunities(filtered);
    setIsSearched(true);
    setSearchedTerm(searchTerm);
  },
  [setFilteredCommunities, communities]
);

const resetSearch = useCallback(() => {
  setIsSearched(false);
  setSearchedTerm("");
  setFilteredCommunities([]);
}, [setIsSearched]);

return (
  <Container>
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.Communities.SearchContainer`}
      props={{
        componentOwnerId,
        handleSearch,
        isSearched,
        searchedTerm,
        searchResultCount: filteredCommunities.length,
        resetSearch,
      }}
    />
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.Communities.CommunityList`}
      props={{
        componentOwnerId,
        communities,
        filteredCommunities,
        isSearched,
      }}
    />
  </Container>
);
