const Loader = styled.div`
  display: inline-block;
  ${({ size }) =>
    size
      ? `width: ${size}px; height: ${size}px;`
      : "width: 20px; height: 20px;"}
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  ${({ color }) =>
    color ? `border-top-color: ${color};` : "border-top-color: #fff;"}
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
`;

return <Loader size={props.size} color={props.color} />;
