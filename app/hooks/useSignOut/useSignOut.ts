import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";

const useSignOut = () => {
  const fetcher = useFetcher();

  const signOut = useCallback(
    (callback?: () => void) => {
      fetcher.submit("", {
        action: "/auth/sign-out",
        method: "POST",
        navigate: false,
      });
      callback?.();
    },
    [fetcher],
  );

  return signOut;
};

export default useSignOut;
