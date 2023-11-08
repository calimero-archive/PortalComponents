const {
  loginApi,
  accountId,
  componentOwnerId,
  onValidLogin,
  logo,
  onAppJoin,
  refresh,
} = props;

const [hasBootstrapped, setHasBootstrapped] = useState(false);
const [hasValidKey, setHasValidKey] = useState(false);
const [loading, setLoading] = useState(false);

const checkMembership = (accountId) => {
  return loginApi
    .getMembers()
    .then((memberList) =>
      memberList.map((member) => member.id).includes(accountId)
    );
};

const bootstrap = () => {
  setLoading(true);

  loginApi
    .validateKey()
    .then((isValidKey) => {
      if (!isValidKey) {
        console.log("Invalid key");
        setHasValidKey(false);
        return Promise.reject("Invalid key");
      }

      setHasValidKey(true);
      console.log("Valid key");
      return checkMembership(accountId);
    })
    .then((isAlreadyMember) => {
      if (isAlreadyMember) {
        console.log("Is member");
        return true;
      }

      console.log("Not a member, attempting to join...");
      return loginApi.join().then(() => checkMembership(accountId));
    })
    .then((isNowMember) => {
      if (isNowMember) {
        onValidLogin();
      } else {
        console.log("Failed to join");
      }
    })
    .catch((error) => {
      console.log("Bootstrap error:", error);
    })
    .finally(() => {
      setLoading(false);
      setHasBootstrapped(true);
    });
};

const join = () => {
  setLoading(true);
  loginApi
    .join()
    .then((result) => {
      if (result) {
        setIsMember(true);
        onValidLogin();
      }
    })
    .finally(() => {
      setLoading(false);
    });
};

useEffect(() => {
  if (accountId && !hasBootstrapped && !loading) {
    bootstrap();
  }
}, [accountId, hasBootstrapped, loading]);

if (loading) {
  return (
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Common.Popups.Loading`}
      props={{ logo }}
    />
  );
}

if (!accountId) {
  return (
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Common.Login.LoginPopup`}
      props={{ logo }}
    />
  );
}

if (!hasValidKey) {
  return (
    <Widget
      src={`${componentOwnerId}/widget/Calimero.Common.Login.JoinPopup`}
      props={{
        logo,
        join: loginApi.login,
        refresh,
      }}
    />
  );
}

return (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Common.Popups.AutoRefresh`}
    props={{ logo, refresh }}
  />
);
