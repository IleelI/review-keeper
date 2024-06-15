import { redirect, type LoaderFunctionArgs } from "@vercel/remix";

import { getUser } from "~/.server/service/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};
