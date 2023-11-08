const handleSearch = props.handleSearch;
const searchedTerm = props.searchedTerm;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 36px;
  border-radius: 4px;
`;

const SearchBox = styled.input`
  width: 347px;
  padding: 6px 12px 6px 12px;
  border-radius: 4px 0px 0px 4px;
  background-color: #37373f;
  ::placeholder {
    color: #6c757d;
  }
  color: #fff;
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

const Text = styled.p`
  padding: 0;
  margin: 0;
`;

const [searchTerm, setSearchTerm] = useState(searchedTerm);

return (
  <Container>
    <SearchBox
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search communities"
    />
    <SearchButton onClick={() => handleSearch(searchTerm)}>
      <i className="bi bi-search"></i>
      <Text>Search</Text>
    </SearchButton>
  </Container>
);
