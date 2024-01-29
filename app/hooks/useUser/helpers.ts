import { AppUser } from "~/models/user";

export const isUser = (user: unknown): user is AppUser => {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
};
