const reaction = props.reaction;
const handleReaction = props.handleReaction;

const ReactionEmojiWrapper = styled.div`
  position: relative;
  height: 24px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  ${({ isOwnReaction }) =>
    isOwnReaction ? "background-color: #372D19;" : "background-color: #1e1f28;"}
  :hover {
    ${({ isOwnReaction }) =>
      isOwnReaction
        ? "background-color: #4D3F24;"
        : "background-color: #2A2B37;"}
  }
  border-radius: 4px;
`;

const ReactionAccountsContainer = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  height: 80px;
  width: 281px;
  column-gap: 8px;
  font-size: 1.5rem;
  line-height: 1.75rem;
  background-color: #1d1d21;
  border-radius: 4px;
  padding: 8px;
`;

const HoverContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 0rem;
  z-index: 2000;
  padding: 20px 20px 20px 0px;
`;

const ReactedByReaction = styled.div`
  width: 32px;
  height: 32px;
`;

const ReactedByContainer = styled.div`
  font-family: Helvetica Neue;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
`;

const ReactionCountWrapper = styled.div`
  font-size: 12px;
  line-height: 100%;
  color: #fff;
`;

const OthersButton = styled.span`
  color: #4e95ff;
  text-decoration: underline;
`;

const ReactionDescription = ({ accounts }) => {
  const accountsCount = accounts.length;

  if (accountsCount <= 3) {
    return <>{`reacted by ${accounts.join(", ")}`}</>;
  } else {
    const initialAccounts = accounts.slice(0, 3).join(", ");
    const othersCount = accountsCount - 3;
    return (
      <>
        {`reacted by ${initialAccounts} and`}
        <OthersButton>
          {" "}
          {`${othersCount} other${othersCount > 1 ? "s" : ""}`}
        </OthersButton>
      </>
    );
  }
};

const [showWhoReacted, setShowWhoReacted] = useState(false);

return (
  <ReactionEmojiWrapper
    key={id}
    isOwnReaction={reaction.accounts.includes(context.accountId)}
    onClick={() => handleReaction(reaction.reaction)}
    onMouseEnter={() => setShowWhoReacted(true)}
    onMouseLeave={() => setShowWhoReacted(false)}
  >
    {reaction.reaction}
    <ReactionCountWrapper>
      {reaction.accounts.length.toString()}
    </ReactionCountWrapper>
    {showWhoReacted && (
      <HoverContainer>
        <ReactionAccountsContainer>
          <ReactedByReaction>{reaction.reaction}</ReactedByReaction>
          <ReactedByContainer>
            <ReactionDescription accounts={reaction.accounts} />
          </ReactedByContainer>
        </ReactionAccountsContainer>
      </HoverContainer>
    )}
  </ReactionEmojiWrapper>
);
