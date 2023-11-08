const selectedTabIndex = props.selectedTabIndex ?? 0;
const setSelectedTabIndex = props.setSelectedTabIndex;
const userCount = props.userCount ?? 0;

const Popup = styled.div`
  display: flex;
  align-items: center;
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  padding-top: 1rem;
  border-bottom: solid 1px #282933;
  margin-bottom: 1rem;
`;

const SwitchOption = styled.div`
  display: flex;
  column-gap: 0.5rem;
  padding-right: 1rem;
  ${({ leftPadding }) => leftPadding && "padding-left: 1rem;"}
  cursor: pointer;
  ${({ selected }) => (selected ? "color: #5765F2" : "color: #fff;")}
`;

const items = [
  {
    name: "About",
    icon: "bi bi-info-circle-fill",
  },
  {
    name: `Members ${userCount}`,
    icon: "bi bi-people-fill",
  },
];

return (
  <Popup>
    {items.map((item, index) => (
      <SwitchOption
        selected={selectedTabIndex === index}
        onClick={() => setSelectedTabIndex(index)}
      >
        <i className={item.icon}></i>
        <p>{item.name}</p>
      </SwitchOption>
    ))}
  </Popup>
);
