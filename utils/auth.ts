import { useMatchesData } from "~/hooks/useMatchesData";
import { AppUser } from "~/models/user";

const DEFAULT_REDIRECT = "/";

export function getSafeRedirectPath(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

export function isAppUser(user: unknown): user is AppUser {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useUser() {
  const data = useMatchesData("root");
  if (!data || !isAppUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useRequiredUser() {
  const user = useUser();
  if (!user) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return user;
}
