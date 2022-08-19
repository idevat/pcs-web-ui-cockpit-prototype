import React from "react";
import { useSelector } from "react-redux";

import { selectors } from "app/store";
import { useDispatch } from "app/view/share/useDispatch";

import { EnvWrapperCockpit } from "./EnvWrapperCockpit";
import { EnvWrapperStandalone } from "./EnvWrapperStandalone";

const EnvWrapper =
  process.env.REACT_APP_PCS_WEB_UI_ENVIRONMENT === "cockpit"
    ? EnvWrapperCockpit
    : EnvWrapperStandalone;
export const AppPage = () => {
  const dispatch = useDispatch();

  const getClusterNameList = useSelector(selectors.getClusterNameList);

  React.useEffect(() => {
    dispatch({
      type: "FETCH_CLUSTER_LIST",
    });
  }, [dispatch]);

  return (
    <EnvWrapper>
      <div>
        <div>ClusterList</div>
        {getClusterNameList === undefined && <span>Loading...</span>}
        {getClusterNameList !== undefined
          && getClusterNameList.map((clusterName, i) => (
            <div key={i}>{clusterName}</div>
          ))}
      </div>
    </EnvWrapper>
  );
};
