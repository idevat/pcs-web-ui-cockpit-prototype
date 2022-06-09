import { all } from "redux-saga/effects";

import { importedClusterList, rememberCluster } from "app/backend";
import { ActionMap } from "app/store/actions";

import { api, put, takeEvery } from "./common";

function* fetchClusterList() {
  const result: api.ResultOf<typeof importedClusterList> =
    yield importedClusterList();
  if (result.type !== "OK") {
    console.log("FAIL:");
    console.log(result);
    return;
  }

  console.log("SUCCESS:");
  console.log(result);
}

function* rememberClusterSaga({
  payload: { clusterName, nodeNameList },
}: ActionMap["REMEMBER_CLUSTER"]) {
  const result: api.ResultOf<typeof rememberCluster> = yield rememberCluster({
    clusterName,
    nodeNameList,
  });
  if (result.type !== "OK") {
    console.log("FAIL:");
    console.log(result);
    return;
  }

  console.log("SUCCESS:");
  console.log(result);
}

export function* login() {
  let response = "";
  yield global.cockpit
    .spawn(["/home/user1/projects/pcs/pcs/pcs", "pcsd", "create-ui-session"])
    .stream((data: string) => {
      response += data;
    });

  const { session_id: sessionId } = JSON.parse(response);

  global.pcsdSid = sessionId;

  yield put({
    type: "SESSION_ID_LOAD.OK",
    payload: {
      sessionId,
    },
  });
}

function* rootSaga() {
  yield all([
    takeEvery("SESSION_ID_LOAD", login),
    takeEvery("FETCH_CLUSTER_LIST", fetchClusterList),
    takeEvery("REMEMBER_CLUSTER", rememberClusterSaga),
  ]);
}

export { rootSaga };
