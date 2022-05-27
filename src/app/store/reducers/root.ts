import { combineReducers } from "redux";

import { AppReducer } from "app/store/reducers/appReducer";

export const sessionId: AppReducer<string> = (state = "", action) => {
  switch (action.type) {
    case "SESSION_ID_LOAD.OK":
      return action.payload.sessionId;

    default:
      return state;
  }
};

export const root = () =>
  combineReducers({
    sessionId,
  });
