import { useMatchesData } from "../useMatchesData/useMatchesData";

import { isUser } from "./helpers";

export default function useUser() {
  const data = useMatchesData("root");
  const user = data?.user;
  if (!isUser(user)) return null;
  return user;
}
