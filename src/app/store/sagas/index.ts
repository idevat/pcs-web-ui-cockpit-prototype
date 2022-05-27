import { all } from "redux-saga/effects";

import { put, takeEvery } from "./common";

export function* login() {
  yield put({
    type: "SESSION_ID_LOAD.OK",
    payload: {
      sessionId: (Math.random() + 1).toString(36).substring(7),
    },
  });
}

function* rootSaga() {
  yield all([takeEvery("SESSION_ID_LOAD", login)]);
}

export { rootSaga };
