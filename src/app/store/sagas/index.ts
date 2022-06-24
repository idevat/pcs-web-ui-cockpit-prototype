import { all } from "redux-saga/effects";

import { importedClusterList, rememberCluster } from "app/backend";
import { ActionMap } from "app/store/actions";

import { api, put, takeEvery } from "./common";

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

export function* login() {
  let response_message = "";
  yield global.cockpit
    .spawn(["/home/user1/projects/pcs/pcs/pcs", "pcsd", "create-ui-session"])
    .stream((data: string) => {
      response_message += data;
    });

  // TODO deal with no-json response
  // TODO deal with missing keys in json response
  const response = JSON.parse(response_message);

  if (response.result === "ok") {
    const {
      payload: { session_id: sessionId },
    } = response;
    global.pcsdSid = sessionId;
    console.log("load session id: success");

    yield put({ type: "AUTH.SUCCESS" });
    return;
  }

  const { code, message } = response.payload;
  yield put({ type: "AUTH.FAILED", payload: { code, message } });
}

function* rootSaga() {
  yield all([
    takeEvery("AUTH.REQUIRED", login),
    takeEvery("FETCH_CLUSTER_LIST", fetchClusterList),
    takeEvery("REMEMBER_CLUSTER", rememberClusterSaga),
  ]);
}

export { rootSaga };
