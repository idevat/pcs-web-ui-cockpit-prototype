import { useSelector } from "react-redux";

import { selectors } from "app/store";
import { useDispatch } from "app/view/share/useDispatch";

export const AppPage = () => {
  const sessionId = useSelector(selectors.getSessionId);
  const dispatch = useDispatch();
  return (
    <div className="App">
      <header className="App-header">
        <p>HA Cluster Management prototype</p>
      </header>
      {sessionId.length > 0 && <div>{`Session: ${sessionId}`}</div>}
      {sessionId.length === 0 && <div>No session</div>}
      <button
        onClick={() =>
          dispatch({
            type: "SESSION_ID_LOAD",
          })
        }
      >
        Load session id
      </button>
      {sessionId.length > 0 && (
        <button
          onClick={() =>
            dispatch({
              type: "FETCH_CLUSTER_LIST",
            })
          }
        >
          Load cluster list
        </button>
      )}
    </div>
  );
};
