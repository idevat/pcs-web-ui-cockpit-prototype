import React from "react";
import { useSelector } from "react-redux";

import { selectors } from "app/store";
import { useDispatch } from "app/view/share/useDispatch";

export const AppPage = () => {
  const dispatch = useDispatch();

  const getClusterNameList = useSelector(selectors.getClusterNameList);

  React.useEffect(() => {
    dispatch({
      type: "FETCH_CLUSTER_LIST",
    });
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <p>HA Cluster Management prototype</p>
        <div>
          {getClusterNameList === undefined && <span>Loading...</span>}
          {getClusterNameList !== undefined
            && getClusterNameList.map((clusterName, i) => (
              <div key={i}>{clusterName}</div>
            ))}
        </div>
      </header>
    </div>
  );
};
