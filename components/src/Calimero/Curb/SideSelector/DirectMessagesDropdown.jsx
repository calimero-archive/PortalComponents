const title = props.title;
const onToggleDMs = props.onToggleDMs;
const directMessagesOpen = props.directMessagesOpen;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0e0e10;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #777583;
  :hover {
    color: #ffffff;
  }
  cursor: pointer;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;
const TextBold = styled.div`
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`;
const IconChevronContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
`;

const IconChevron = styled.i`
  transition: transform 5s ease;
  cursor: pointer;
`;

return (
  <Container onClick={() => onToggleDMs(!directMessagesOpen)}>
    <TextBold>{title}</TextBold>
    <IconChevronContainer>
      <IconChevron
        className={`${
          directMessagesOpen ? "bi bi-chevron-down" : "bi bi-chevron-up"
        }`}
      />
    </IconChevronContainer>
  </Container>
);
