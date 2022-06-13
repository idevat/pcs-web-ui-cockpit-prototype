import { combineReducers } from "redux";

import { AppReducer } from "app/store/reducers/appReducer";

const dashboardInitialState: {
  clusterNameList: string[] | undefined;
} = {
  clusterNameList: undefined,
};

export const dashboard: AppReducer<typeof dashboardInitialState> = (
  state = dashboardInitialState,
  action,
) => {
  switch (action.type) {
    case "FETCH_CLUSTER_LIST.OK":
      return {
        ...state,
        clusterNameList: action.payload.clusterNameList,
      };

    default:
      return state;
  }
};

export const root = () =>
  combineReducers({
    dashboard,
  });
