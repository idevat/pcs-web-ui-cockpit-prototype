import { combineReducers } from "redux";

import { AppReducer } from "app/store/reducers/appReducer";

const dashboardInitialState: {
  clusterNameList: string[] | undefined;
} = {
  clusterNameList: undefined,
};

const dashboard: AppReducer<typeof dashboardInitialState> = (
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

const authInitialState: {
  error:
    | undefined
    | {
        code: string;
        message: string;
      };
} = {
  error: undefined,
};

const auth: AppReducer<typeof authInitialState> = (
  state = authInitialState,
  action,
) => {
  switch (action.type) {
    case "AUTH.FAILED":
      return {
        ...state,
        error: { code: action.payload.code, message: action.payload.message },
      };
    case "AUTH.SUCCESS":
    case "AUTH.REQUIRED":
      return {
        ...state,
        error: undefined,
      };
    default:
      return state;
  }
};

export const root = () =>
  combineReducers({
    auth,
    dashboard,
  });
