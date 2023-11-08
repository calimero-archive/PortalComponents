const Banner = styled.div`
  font-size: 0.875rem;
  display: flex;
  column-gap: 1rem;
  line-height: 1.25rem;
  text-align: center;
  color: #ffffff;
  justify-content: center;
  align-items: center;
`;

return (
  <Banner>
    <i className="bi bi-chevron-double-left"></i>
    <p className="pt-3">New unread messages</p>
    <i className="bi bi-chevron-double-right"></i>
  </Banner>
);
