import { redirect } from "@remix-run/node";

import { signOut } from "~/server/auth.server";

export async function action() {
  return await signOut();
}

export async function loader() {
  return redirect("/");
}
