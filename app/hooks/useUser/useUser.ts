import { AppUser } from "~/models/user";

import { useMatchesData } from "../useMatchesData/useMatchesData";

export function isUser(user: unknown): user is AppUser {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export default function useUser() {
  const data = useMatchesData("root");
  const user = data?.user;
  if (!user || !isUser(user)) return null;
  return user;
}
