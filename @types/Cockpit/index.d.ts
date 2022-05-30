type ProcessErr = {
  message?: string;
  problem?: string;
  exit_status?: number;
  exit_signal?: string;
};

enum ProcessErrCodes {
  "access-denied",
  "authentication-failed",
  "internal-error",
  "no-cockpit",
  "no-session",
  "not-found",
  "terminated",
  "timeout",
  "unknown-hostkey",
  "no-forwarding",
}

type ProcessPromise = {
  done: (_cb: (_data: string, _message?: string) => void) => ProcessPromise;
  fail: (_cb: (_err: ProcessErr, _data?: string) => void) => ProcessPromise;
  stream: (_cb: (_data: string) => void) => ProcessPromise;
  input: (_data: string, _stream?: boolean) => ProcessPromise;
  close: (_err?: ProcessErrCodes) => ProcessPromise;
};

type Cockpit = {
  spawn(_arguments: Array<string>, _parameters?: object): ProcessPromise;
};

// indicate that the file is a module
// https://stackoverflow.com/a/59499895
// https://stackoverflow.com/a/42257742
export {};

declare global {
  /* eslint-disable-next-line  */
  var cockpit: Cockpit
}
