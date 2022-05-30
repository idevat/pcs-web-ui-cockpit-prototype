import { all } from "redux-saga/effects";

import { put, takeEvery } from "./common";

function* rootSaga() {
  yield all([takeEvery("SESSION_ID_LOAD", login)]);
}

export function* login() {
  let response = "";
  yield global.cockpit
    .spawn(["/home/user1/projects/pcs/pcs/pcs", "pcsd", "create-ui-session"])
    .stream((data: string) => {
      response += data;
    });

  const { session_id: sessionId } = JSON.parse(response);

  yield put({
    type: "SESSION_ID_LOAD.OK",
    payload: {
      sessionId,
    },
  });
}

export { rootSaga };
