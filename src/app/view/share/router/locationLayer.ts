/**
 * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
 */
const popstate = "popstate";
const pushState = "pushState";
const replaceState = "replaceState";
const events = [popstate, pushState, replaceState];

export const locationLayer =
  process.env.REACT_APP_PCS_WEB_UI_ENVIRONMENT === "cockpit"
    ? {
        getPath: () => cockpit.location.href.split("?")[0],

        getSearch: () => {
          const parts = cockpit.location.href.split("?");
          return (parts[1] || "").length > 0 ? `?${parts[1]}` : "";
        },

        addEventsListener: (listener: () => void) =>
          cockpit.addEventListener("locationchanged", listener),

        removeEventsListener: (listener: () => void) =>
          cockpit.removeEventListener("locationchanged", listener),

        navigate: (to: string, { replace = false } = {}) =>
          cockpit.location[replace ? "replace" : "go"](to),
      }
    : {
        getPath: () => window.location.pathname,

        getSearch: () => window.location.search,

        addEventsListener: (listener: () => void) =>
          events.forEach(e => window.addEventListener(e, listener)),

        removeEventsListener: (listener: () => void) =>
          events.forEach(e => window.removeEventListener(e, listener)),

        navigate: (to: string, { replace = false } = {}) =>
          window.history[replace ? replaceState : pushState](null, "", to),
      };
