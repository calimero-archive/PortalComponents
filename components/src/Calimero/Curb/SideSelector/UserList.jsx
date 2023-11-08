const users = props.users ?? [];
const componentOwnerId = props.componentOwnerId;
const selectedDM = props.selectedDM;
const onDMSelected = props.onDMSelected;

return (
  <>
    {users.map((user) => (
      <Widget
        src={`${componentOwnerId}/widget/Calimero.Curb.SideSelector.UserItem`}
        props={{
          user,
          onDMSelected,
          selected: selectedDM === user.id,
          componentOwnerId,
        }}
        key={user.id}
      />
    ))}
  </>
);
