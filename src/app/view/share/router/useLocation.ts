import { useCallback, useEffect, useRef, useState } from "react";

import { locationLayer } from "./locationLayer";
import { Path } from "./types";

const currentPathname = (base: string, path = locationLayer.getPath()) =>
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
    return {
      path: currentPathname(base),
      search: locationLayer.getSearch(),
    };
  }); // @see https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const prevHash = useRef(path + search);

  useEffect(() => {
    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.
    const checkForUpdates = () => {
      const pathname = currentPathname(base);
      const search = locationLayer.getSearch();
      const hash = pathname + search;

      if (prevHash.current !== hash) {
        prevHash.current = hash;
        update({ path: pathname, search });
      }
    };

    locationLayer.addEventsListener(checkForUpdates);

    // it's possible that an update has occurred between render and the effect
    // handler, so we run additional check on mount to catch these updates.
    // Based on:
    // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
    checkForUpdates();

    return () => locationLayer.removeEventsListener(checkForUpdates);
  }, [base]);

  // the 2nd argument of the `useLocation` return value is a function
  // that allows to perform a navigation.
  //
  // the function reference should stay the same between re-renders, so that
  // it can be passed down as an element prop without any performance concerns.
  const navigate = useCallback(
    (to: string, { replace = false } = {}) => {
      locationLayer.navigate(to[0] === "~" ? to.slice(1) : base + to, {
        replace,
      });
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
if (
  process.env.REACT_APP_PCS_WEB_UI_ENVIRONMENT !== "cockpit"
  && typeof window.history !== "undefined"
) {
  const originalPushState = window.history.pushState;

  window.history.pushState = function (
    ...args: Parameters<typeof window.history.pushState>
  ) {
    const result = originalPushState.apply(this, args);
    const event = new CustomEvent("pushState", { detail: args });

    dispatchEvent(event);
    return result;
  };

  const originalReplaceState = window.history.replaceState;

  window.history.replaceState = function (
    ...args: Parameters<typeof window.history.replaceState>
  ) {
    const result = originalReplaceState.apply(this, args);
    const event = new CustomEvent("replaceState", { detail: args });

    dispatchEvent(event);
    return result;
  };
}
