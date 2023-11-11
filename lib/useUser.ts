import { useEffect } from "react";
import Router from "next/router";
import {useSession} from "next-auth/react";

export default function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if ((redirectTo && !redirectIfFound && !user) || (redirectIfFound && user)) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user };
}