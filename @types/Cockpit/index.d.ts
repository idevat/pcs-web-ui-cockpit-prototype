type ProcessErr = {
  message?: string;
  problem?: string;
  exit_status?: number;
  exit_signal?: string;
};

enum ErrCodes {
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
  close: (_err?: ErrCodes) => ProcessPromise;
};

type HttpOptions = {
  address?: string;
  tls?: {
    validate?: boolean;
  };
};

type HttpHeaders = Record<string, string>;

type HttpOperations = {
  close: (problem?: ErrCodes) => void;
  get: (
    path: string,
    params: Record<string, string | string[]>,
    headers: HttpHeaders
  ) => HttpOperationsPromise;
  post: (
    path: string,
    body: string | Record<string, string>,
    headers: HttpHeaders
  ) => HttpOperationsPromise;
  request(options: HttpRequestOptions): HttpOperationsPromise;
};

type Cockpit = {
  spawn(_arguments: Array<string>, _parameters?: object): ProcessPromise;
  transport: {
    csrf_token: string;
    wait: (_cb: () => void) => void;
  };
  http: (endpoint: string | number, options?: HttpOptions) => HttpOperations;
  location: {
    href: string;
    path: string[];
    options: Record<string, string | string[]>;
    go: (path: string, opts?: Record<string, string | string[]>) => void;
    replace: (path: string, opts?: Record<string, string | string[]>) => void;
  };
  addEventListener(type: string, handler: () => void);
  removeEventListener(type: string, handler: () => void);
};

// indicate that the file is a module
// https://stackoverflow.com/a/59499895
// https://stackoverflow.com/a/42257742
export {};

declare global {
  /* eslint-disable-next-line  */
  var cockpit: Cockpit
  /* eslint-disable-next-line  */
  var pcsdSid: string
}
