const userId = props.accountId;
const render = props.render;
const wsAddress = props.wsAddress ?? "ws://0.0.0.0:6376/ws";
const maxRetries = props.maxRetries ?? 5;
const reconnectDelay = props.reconnectDelay ?? 1000;
const maxDelay = props.maxDelay ?? 30000;
const getAuthToken = props.getAuthToken;

const ConnectionStatus = {
  CONNECTED: "Connected",
  CONNECTING: "Connecting...",
  RECONNECTING: "Reconnecting...",
  DISCONNECTED: "Disconnected",
};

const retryCountRef = useRef(0);
const shouldReconnectRef = useRef(true);
const pingIntervalRef = useRef(null);
const wsTransport = useRef(null);
const connectionStatus = useRef(ConnectionStatus.DISCONNECTED);

const wsApi = {
  send: (command, args, callback) => {
    if (wsTransport.current) {
      wsTransport.current.send(command, args, callback);
      return wsApi;
    }
    throw "WebSocket has not been initialized";
  },
  connect: () => {
    if (connectionStatus.current === ConnectionStatus.DISCONNECTED) {
      retryCountRef.current = 0;
      setupWebSocket();
    } else if (connectionStatus.current === ConnectionStatus.CONNECTED) {
      // throw "Already connected";
    }
    return wsApi;
  },
  disconnect: () => {
    if (wsTransport.current) {
      if (connectionStatus.current === ConnectionStatus.DISCONNECTED) {
        // throw "Already disconnected..";
      } else {
        shouldReconnectRef.current = false;
        wsTransport.current.close();
      }
    } else {
      throw "WebSocket has not been initialized";
    }
    return wsApi;
  },
  notifications: {},
};

function EventEmitter() {
  let store = new Map();

  let register = (persist) => (event, listener, isExclusive) => {
    isExclusive = !!isExclusive;
    if (typeof listener !== "function") throw "listener is not a function";
    let listeners = store.get(event) || store.set(event, []).get(event);
    if (
      listeners.length &&
      (isExclusive || listeners.some((entry) => entry.isExclusive))
    )
      throw "Can't add listener to exclusive event";
    listeners.push({
      persist,
      listener,
      isExclusive,
    });
  };

  return {
    on: register(true),
    once: register(false),
    off: (event, listener) => {
      if (typeof listener !== "function") throw "listener is not a function";
      let idx,
        listeners = store.get(event);
      if (
        listeners &&
        -1 < (idx = listeners.findIndex((entry) => entry.listener === listener))
      ) {
        listeners.splice(idx, 1);
        if (!listeners.length) store.delete(event);
      }
    },
    emit: (event, data) => {
      let listeners = store.get(event);
      if (listeners) {
        listeners = listeners.filter((entry) => {
          entry.listener(data);
          return entry.persist;
        });
        if (!listeners.length) store.delete(event);
        else store.set(event, listeners);
      }
    },
  };
}

const wsApiEvents = useRef(EventEmitter());

const wsApiNotifications = useRef(EventEmitter());

Object.assign(wsApi, {
  on: (event, listener) => {
    wsApiEvents.current.on(event, listener);
    return wsApi;
  },
  once: (event, listener) => {
    wsApiEvents.current.once(event, listener);
    return wsApi;
  },
  off: (event, listener) => {
    wsApiEvents.current.off(event, listener);
    return wsApi;
  },
});

Object.assign(wsApi.notifications, {
  on: (event, listener) => {
    wsApiNotifications.current.on(event, listener);
    return wsApi.notifications;
  },
  once: (event, listener) => {
    wsApiNotifications.current.once(event, listener);
    return wsApi.notifications;
  },
  off: (event, listener) => {
    wsApiNotifications.current.off(event, listener);
    return wsApi.notifications;
  },
});

const setupWebSocket = () => {
  const ws = new WebSocket(wsAddress);

  connectionStatus.current = ConnectionStatus.CONNECTING;

  const commandEvents = EventEmitter();

  wsTransport.current = {
    send: (command, args, callback) => {
      if (ws.readyState === 1 /* OPEN */) {
        let id;
        while (true) {
          id = Math.trunc(Math.random() * (Math.pow(2, 53) - 1));
          try {
            commandEvents.once(
              id,
              ([err, result]) => {
                if (callback)
                  if (err) return callback(err);
                  else callback(null, result);
              },
              true
            );
            break;
          } catch {}
        }
        ws.send(JSON.stringify({ id, command, args }));
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(ping, 15_000);
      } else {
        callback("WebSocket connection is not open");
      }
    },
    close: (code, reason) => ws.close(code, reason),
  };

  function ping() {
    wsTransport.current.send("Ping", [], (err) => {
      if (err) return console.log("[meroship] ping failed:", err);
      if (connectionStatus.current !== ConnectionStatus.CONNECTED) {
        connectionStatus.current = ConnectionStatus.CONNECTED;
        wsApi.send("Init", { account_id: userId }, (err) => {
          if (err)
            return console.log(
              "[meroship] connection initialization failed:",
              err
            );
          wsApiEvents.current.emit("connected");
        });
      }
    });
  }

  ws.onopen = () => {
    wsTransport.current.send(
      "Gateway::Headers",
      {
        "x-api-key": { getAuthToken }.getAuthToken?.(),
      },
      (err) => {
        if (
          err &&
          !(
            err.type === "ParseError" &&
            typeof err.data === "string" &&
            // if there is no gateway infront of meroship, this error is expected, ignore it
            err.data.startsWith("unknown variant `Gateway::Headers`")
          )
        )
          return console.log(
            "[meroship] gateway auth header application failed:",
            err
          );

        retryCountRef.current = 0;
        ping();
      }
    );
  };

  ws.onmessage = (event) => {
    let message = JSON.parse(event.data);

    if (message) {
      if (message.hasOwnProperty("id")) {
        if (message.hasOwnProperty("result")) {
          commandEvents.emit(message.id, [null, message.result]);
          return;
        } else if (message.hasOwnProperty("error")) {
          commandEvents.emit(message.id, [message.error]);
          return;
        }
      } else if (message.hasOwnProperty("event")) {
        wsApiNotifications.current.emit(message.event.type, message.event.data);
        return;
      }
    }

    console.log("[meroship] unknown message:", event.data);
  };

  ws.onclose = () => {
    if (shouldReconnectRef.current && retryCountRef.current < maxRetries) {
      let delay =
        Math.min(
          reconnectDelay * Math.pow(2, retryCountRef.current),
          maxDelay
        ) +
        Math.random() * 1500;
      wsApiEvents.current.emit("disconnected", {
        delay,
        maxRetries,
        trial: retryCountRef.current,
      });
      retryCountRef.current++;
      setTimeout(setupWebSocket, delay);
      connectionStatus.current = `${ConnectionStatus.RECONNECTING} (${retryCountRef.current}/${maxRetries})`;
    } else {
      wsApiEvents.current.emit("disconnected", {
        delay: 0,
        maxRetries,
        trial: retryCountRef.current,
      });
      connectionStatus.current = ConnectionStatus.DISCONNECTED;
    }
  };
};

Object.assign(wsApi, {
  methods: {
    subscribe: (args, callback) => {
      wsApi.send("Subscribe", args, callback);
    },
    unsubscribe: (args, callback) => {
      return wsApi.send("Unsubscribe", args, callback);
    },
    submitTx: (signedTx, callback) => {
      return wsApi.send("SubmitTransaction", [signedTx], callback);
    },
    getAccountsStatus: (accounts, callback) => {
      return wsApi.send("Status", { accounts }, callback);
    },
  },
});

if (render) {
  return render({ wsApi });
}
