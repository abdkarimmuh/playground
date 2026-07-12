import * as React from "react";

function subscribe() {
  return () => {};
}

/**
 * Returns `true` only after the component has hydrated on the client.
 * Uses `useSyncExternalStore` instead of a `useState` + `useEffect` pair
 * so the client flag is never set via a synchronous setState in an effect.
 */
export function useIsClient() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
