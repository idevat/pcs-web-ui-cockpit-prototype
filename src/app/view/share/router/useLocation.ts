import { useCallback, useEffect, useRef, useState } from "react";

import { Path } from "./types";

/**
 * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
 */
const eventPopstate = "popstate";
const eventPushState = "pushState";
const eventReplaceState = "replaceState";
export const events = [eventPopstate, eventPushState, eventReplaceState];

const currentPathname = (
  base: string,
  path = `/${cockpit.location.path.join("/")}`,
) =>
  path.toLowerCase().startsWith(base.toLowerCase())
    ? path.slice(base.length)
    : "~" + path;

export const useLocation = (
  { base }: { base: Path } = { base: "" },
): {
  path: Path;
  navigate: (_to: Path, _options?: { replace?: boolean }) => void;
  search: string;
} => {
  const [{ path, search }, update] = useState(() => {
    const locationParts = cockpit.location.href.split("?");
    return {
      path: currentPathname(base),
      search: (locationParts[1] || "").length > 0 ? `?${locationParts[1]}` : "",
    };
  }); // @see https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const prevHash = useRef(path + search);

  useEffect(() => {
    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.
    const checkForUpdates = () => {
      const locationParts = cockpit.location.href.split("?");
      const pathname = currentPathname(base);
      const search =
        (locationParts[1] || "").length > 0 ? `?${locationParts[1]}` : "";
      const hash = pathname + search;

      if (prevHash.current !== hash) {
        prevHash.current = hash;
        update({ path: pathname, search });
      }
    };
    cockpit.addEventListener("locationchanged", checkForUpdates);

    // events.forEach(e => window.addEventListener(e, checkForUpdates));
    // cockpit.addEventListener("locationchanged", checkForUpdates);

    // it's possible that an update has occurred between render and the effect
    // handler, so we run additional check on mount to catch these updates.
    // Based on:
    // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
    checkForUpdates();

    return () => cockpit.removeEventListener("locationchanged", checkForUpdates);
  }, [base]);

  // the 2nd argument of the `useLocation` return value is a function
  // that allows to perform a navigation.
  //
  // the function reference should stay the same between re-renders, so that
  // it can be passed down as an element prop without any performance concerns.
  const navigate = useCallback(
    (to: string, { replace = false } = {}) => {
      const location = to[0] === "~" ? to.slice(1) : base + to;
      cockpit.location[replace ? "replace" : "go"](location);
      // return window.history[replace ? eventReplaceState : eventPushState](
      //   null,
      //   "",
      //   // handle nested routers and absolute paths
      //   to[0] === "~" ? to.slice(1) : base + to,
      // );
    },
    [base],
  );

  return { path, navigate, search };
};

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
// if (typeof window.history !== "undefined") {
//   const originalGo = cockpit.location.go;
//
//   cockpit.location.go = function (
//     ...args: Parameters<typeof cockpit.location.go>
//   ) {
//     const result = originalGo.apply(this, args);
//     const event = new CustomEvent("pushState", { detail: args });
//
//     dispatchEvent(event);
//     return result;
//   };
//
//   const originalReplaceState = window.history.replaceState;
//
//   window.history.replaceState = function (
//     ...args: Parameters<typeof window.history.replaceState>
//   ) {
//     const result = originalReplaceState.apply(this, args);
//     const event = new CustomEvent("replaceState", { detail: args });
//
//     dispatchEvent(event);
//     return result;
//   };
// }
