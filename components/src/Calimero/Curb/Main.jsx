const initialContract = props.contract || "chat-staging.ws-protocol-63";
const componentOwnerId = props.componentOwnerId || "calimero.testnet";
const encryptionUrl =
  props.encryptionUrl ||
  "https://cali-encryption.euw3.staging.gcp.calimero.network/key";
const meroshipUrl =
  props.meroshipUrl ||
  "wss://api.staging.calimero.network/api/v1/shards/ws-protocol-63-calimero-testnet/meroship/ws";
const accountId = context.accountId;
const enableCommunities = props.enableCommunities ?? false;
const onAppJoined = props.onAppJoined || (() => {});
const onAppJoin = props.onAppJoin || (() => {});
const communities = props.communities || [];
const getCalimeroToken = props.getCalimeroToken || (() => {});
const refresh = props.refresh;

const getSelectedCommunity = useCallback(() => {
  return Storage.innerGet("community").then((value) => {
    if (selectedCommunity === undefined) {
      value = initialContract;
      Storage.set("community", value);
      setContract(value);
    } else {
      setContract(value);
    }
  });
}, [initialContract]);

const [contract, setContract] = useState(null);
const [loggedIn, setLoggedIn] = useState(false);

useEffect(() => {
  getSelectedCommunity();
}, []);

if (!contract) {
  return "Loading";
}

const handleContractChange = useCallback((contract) => {
  changeContract(contract, null);
}, []);

function changeContract(contract, session) {
  Storage.set("community", contract);
  setContract(contract);
  setLoggedIn(false);
  updateInitialChat(session);
}

const PageContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const loginApi = useMemo(
  () => ({
    join: () => {
      onAppJoin();
      Near.fakCalimeroCall(contract, "join");
    },
    login: () => {
      onAppJoin();
      Near.requestCalimeroFak(contract);
    },
    validateKey: () => Near.hasValidCalimeroFak(contract),
    getMembers: () => Near.asyncCalimeroView(contract, "get_members"),
  }),
  [contract]
);

const Logo = () => (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Curb.Navbar.CurbLogo`}
    props={{
      justify: true,
    }}
  />
);

const updateInitialChat = useCallback((session) => {
  Storage.set("lastSession", JSON.stringify(session));
}, []);

const getUrlSession = () => {
  const urlDerivedChatParams = extractQueryParams();
  let derivedSession = null;
  if (
    urlDerivedChatParams &&
    urlDerivedChatParams.type &&
    urlDerivedChatParams.target &&
    urlDerivedChatParams.contractName
  ) {
    if (!communities.includes(urlDerivedChatParams.contractName)) {
      console.log("Error unknown contract id on push notif.");
      return;
    }

    if (urlDerivedChatParams.type === "channel") {
      derivedSession = {
        type: urlDerivedChatParams.type,
        name: urlDerivedChatParams.target,
      };
    } else if (urlDerivedChatParams.type === "dm") {
      derivedSession = {
        type: "direct_message",
        id: urlDerivedChatParams.target,
      };
    }
    changeContract(urlDerivedChatParams.contractName, derivedSession);
  }
  return derivedSession;
};

const getInitialChat = useCallback(() => {
  const derivedSession = getUrlSession();
  if (derivedSession) {
    return derivedSession;
  }
  const storedSession = Storage.innerGet("lastSession");
  return storedSession ? JSON.parse(storedSession) : null;
}, []);

// Ping to prepare the new key, needs to be simplified
const ping = () => Near.fakCalimeroCall(contract, "ping");

const App = (props) => (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Curb.WebSocketManager`}
    props={{
      accountId: props.accountId,
      wsAddress: meroshipUrl,
      getAuthToken: getCalimeroToken,
      render: ({ wsApi }) => (
        <Widget
          src={`${componentOwnerId}/widget/Calimero.Curb.AppContainer`}
          props={{
            ...props,
            wsApi,
          }}
        />
      ),
    }}
  />
);

return (
  <PageContainer>
    {!loggedIn || !accountId ? (
      <Widget
        src={`${componentOwnerId}/widget/Calimero.Common.Login.index`}
        props={{
          loginApi,
          accountId: context.accountId,
          componentOwnerId,
          onValidLogin: () => {
            onAppJoined(accountId);
            // todo! migrate to meroship
            ping().then(() => {
              setLoggedIn(true);
            });
          },
          logo: <Logo />,
          onAppJoin,
          refresh,
        }}
      />
    ) : (
      <App
        componentOwnerId={componentOwnerId}
        contract={contract}
        encryptionUrl={encryptionUrl}
        accountId={context.accountId}
        enableCommunities={enableCommunities}
        handleContractChange={handleContractChange}
        initialChat={getInitialChat()}
        updateInitialChat={updateInitialChat}
        communities={communities}
      />
    )}
  </PageContainer>
);
