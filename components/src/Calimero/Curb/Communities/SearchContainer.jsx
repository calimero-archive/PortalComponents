const componentOwnerId = props.componentOwnerId;
const handleSearch = props.handleSearch;
const isSearched = props.isSearched;
const searchedTerm = props.searchedTerm;
const searchResultCount = props.searchResultCount;
const resetSearch = props.resetSearch;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${({ isSearched }) =>
    isSearched
      ? "align-items: start; padding-bottom: 0px; background-color: transparent;"
      : "align-items: center; justify-content: center; height: 277px; background-color: #1d1d21;"}
  width: 100%;
  top: 127px;
  left: 60px;
  border-radius: 4px;
  padding: 24px;
  color: #fff;
  font-family: Helvetica Neue;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 500;
  line-height: 29px;
  letter-spacing: 0em;
  height: 29px;
  margin-bottom: 11px;
`;

const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  margin-bottom: 26px;
`;

const SearchResultContainer = styled.div`
  display: flex;
  column-gap: 16px;
  justify-content: center;
`;

const SearchResult = styled.h5`
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
`;

const BackIcon = styled.i`
  cursor: pointer;
  color: #6c757d;
  :hover {
    color: #fff;
  }
`;

const searchText =
  searchResultCount === 1
    ? `${searchResultCount} community for “${searchedTerm}”`
    : `${searchResultCount} communities for “${searchedTerm}”`;

return (
  <SearchContainer isSearched={isSearched}>
    {isSearched ? (
      <SearchResultContainer>
        <BackIcon className="bi bi-arrow-left" onClick={resetSearch}></BackIcon>
        <SearchResult>{searchText}</SearchResult>
      </SearchResultContainer>
    ) : (
      <>
        <Title>Discover communities on Calimero</Title>
        <Subtitle>
          From your favourite projects to Near protocol updates...
        </Subtitle>
      </>
    )}
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Curb.Communities.Search`}
      props={{
        componentOwnerId,
        handleSearch,
        searchedTerm,
      }}
    />
  </SearchContainer>
);
