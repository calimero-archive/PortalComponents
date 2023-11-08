const backgroundColor = props.backgroundColor;

const MessagesBubble = styled.div`
  color: #fff;
  ${({ backgroundColor }) =>
    backgroundColor && `background-color: ${backgroundColor};`}
  display: flex;
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  font-size: 12px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

return (
  <MessagesBubble backgroundColor={backgroundColor}>
    {props.messageCount}
  </MessagesBubble>
);
