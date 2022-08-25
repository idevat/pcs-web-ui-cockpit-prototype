import React from "react";
import { useSelector } from "react-redux";

import { selectors } from "app/store";
import { useDispatch } from "app/view/share/useDispatch";
import { Link } from "app/view/share";

export const DashboardPage = () => {
  const dispatch = useDispatch();

  const getClusterNameList = useSelector(selectors.getClusterNameList);

  React.useEffect(() => {
    dispatch({
      type: "FETCH_CLUSTER_LIST",
    });
  }, [dispatch]);

  return (
    <div>
      <div>ClusterList</div>
      {getClusterNameList === undefined && <span>Loading...</span>}
      {getClusterNameList !== undefined
        && getClusterNameList.map((clusterName, i) => (
          <Link key={i} to={`~/cluster/${clusterName}`}>
            <strong>{clusterName}</strong>
          </Link>
        ))}
    </div>
  );
};
