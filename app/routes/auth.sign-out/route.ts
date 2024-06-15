import { redirect } from "@vercel/remix";

import { signOut } from "~/.server/service/auth";

export async function action() {
  return await signOut();
}

export async function loader() {
  return redirect("/");
}
