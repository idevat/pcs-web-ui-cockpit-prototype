import { SagaIterator } from "redux-saga";

import { api } from "app/backend";

import { call, put, take } from "./effects";
import * as log from "./log";

export function* authSafe<
  PAYLOAD,
  RESULT extends api.result.Overall<PAYLOAD>,
  PARAMS extends unknown[],
>(
  fn: (..._fnArgs: PARAMS) => Promise<RESULT>,
  ...args: PARAMS
): SagaIterator<RESULT> {
  // explicit typing of the yielded value is unfortunatelly neccessary
  // https://github.com/microsoft/TypeScript/issues/32523
  // https://github.com/microsoft/TypeScript/issues/26959
  let response: RESULT = yield call<typeof fn>(fn, ...args);
  if (response.type === "UNAUTHORIZED") {
    // Ok, we got 401. So, ask for credentials and wait for login success...
    yield put({ type: "AUTH.REQUIRED" });
    yield take("AUTH.SUCCESS");
    // ...and then second attempt.
    response = yield call(fn, ...args);
    if (response.type === "UNAUTHORIZED") {
      log.stillUnauthorized();
    }
  }
  return response;
}
