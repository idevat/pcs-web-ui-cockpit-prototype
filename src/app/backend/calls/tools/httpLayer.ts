export const httpLayer =
  process.env.REACT_APP_PCS_WEB_UI_ENVIRONMENT === "cockpit"
    ? {
        get: async (path: string, headers: Record<string, string>) => {
          try {
            const http = cockpit.http("/tmp/pcsd-unix.sock");
            const result = await http.get(path, {}, headers);
            return {
              status: 200,
              statusText: "OK",
              text: result,
            };
          } catch (e) {
            const exception = e as {
              message: string;
              status: number;
              reason: string;
            };
            return {
              status: exception.status,
              statusText: exception.reason,
              text: exception.message,
            };
          }
        },
        // TODO
        post: cockpit.http("/tmp/pcsd-unix.sock").post,
      }
    : {
        get: async (path: string, headers: Record<string, string>) => {
          const response = await fetch(path, { headers });
          return {
            status: response.status,
            statusText: response.statusText,
            text: await response.text(),
          };
        },
        post: async (
          path: string,
          body: string,
          headers: Record<string, string>,
        ) => {
          const response = await fetch(path, { method: "post", headers, body });
          return {
            status: response.status,
            statusText: response.statusText,
            text: await response.text(),
          };
        },
      };
