import { all } from "redux-saga/effects";

import { importedClusterList, login, rememberCluster } from "app/backend";
import { ActionMap } from "app/store/actions";

import { api, call, put, takeEvery } from "./common";

function* fetchClusterList() {
  const result: api.ResultOf<typeof importedClusterList> = yield api.authSafe(
    importedClusterList,
  );
  if (result.type !== "OK") {
    console.log("FAIL:");
    console.log(result);
    return;
  }

  console.log("SUCCESS:");
  console.log(result);
  yield put({
    type: "FETCH_CLUSTER_LIST.OK",
    payload: {
      clusterNameList: result.payload.cluster_list.map(c => c.name),
    },
  });
}

function* rememberClusterSaga({
  payload: { clusterName, nodeNameList },
}: ActionMap["REMEMBER_CLUSTER"]) {
  const result: api.ResultOf<typeof rememberCluster> = yield api.authSafe(
    rememberCluster,
    { clusterName, nodeNameList },
  );
  if (result.type !== "OK") {
    console.log("FAIL:");
    console.log(result);
    return;
  }

  console.log("SUCCESS:");
  console.log(result);
}

export function* loginAuthRequired() {
  // let response_message = "";
  // yield global.cockpit
  //   .spawn(["/home/user1/projects/pcs/pcs/pcs", "pcsd", "create-ui-session"])
  //   .stream((data: string) => {
  //     response_message += data;
  //   });
  //
  // // TODO deal with no-json response
  // // TODO deal with missing keys in json response
  // const response = JSON.parse(response_message);
  //
  // if (response.result === "ok") {
  //   const {
  //     payload: { session_id: sessionId },
  //   } = response;
  //   global.pcsdSid = sessionId;
  //   console.log("load session id: success");
  //
  //   yield put({ type: "AUTH.SUCCESS" });
  //   return;
  // }
  //
  // const { code, message } = response.payload;
  const code = "AUTH-FAILED";
  const message = "Auth failed";

  yield put({ type: "AUTH.FAILED", payload: { code, message } });
}

export function* loginSaga({
  payload: { username, password },
}: ActionMap["LOGIN.ENTER_CREDENTIALS"]) {
  console.log("GO CALL LOGIN");
  const result: api.ResultOf<typeof login> = yield call(
    login,
    username,
    password,
  );
  console.log("LOgin CALLED WITH RESULT", result);

  if (result.type !== "OK") {
    yield put({
      type: "LOGIN.FAILED",
      payload: {
        badCredentials: result.type === "UNAUTHORIZED",
        message:
          result.type === "UNAUTHORIZED"
            ? ""
            : `Communication error: ${result.status}, ${result.text}`,
      },
    });
    return;
  }
  yield put({ type: "AUTH.SUCCESS" });
}

function* rootSaga() {
  yield all([
    takeEvery("AUTH.REQUIRED", loginAuthRequired),
    takeEvery("FETCH_CLUSTER_LIST", fetchClusterList),
    takeEvery("REMEMBER_CLUSTER", rememberClusterSaga),
    takeEvery("LOGIN.ENTER_CREDENTIALS", loginSaga),
  ]);
}

export { rootSaga };
