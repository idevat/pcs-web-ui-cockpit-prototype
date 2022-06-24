import React from "react";
import { useSelector } from "react-redux";

import { selectors } from "app/store";
import { useDispatch } from "app/view/share/useDispatch";

export const AppPage = () => {
  const dispatch = useDispatch();

  const getClusterNameList = useSelector(selectors.getClusterNameList);
  const authError = useSelector(selectors.authError);

  React.useEffect(() => {
    dispatch({
      type: "FETCH_CLUSTER_LIST",
    });
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <p>HA Cluster Management prototype</p>
      </header>
      {authError && (
        <div>
          Authentication error happened.
          <div>Code:{authError.code} </div>
          <div>Message:{authError.message} </div>
          <button
            onClick={() =>
              dispatch({
                type: "AUTH.REQUIRED",
              })
            }
          >
            Try again
          </button>
        </div>
      )}
      {authError === undefined && (
        <div>
          {getClusterNameList === undefined && <span>Loading...</span>}
          {getClusterNameList !== undefined
            && getClusterNameList.map((clusterName, i) => (
              <div key={i}>{clusterName}</div>
            ))}
        </div>
      )}
    </div>
  );
};
