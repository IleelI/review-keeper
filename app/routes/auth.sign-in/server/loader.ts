import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

import { getUser } from "~/.server/service/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};
