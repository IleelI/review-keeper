import { redirect } from "@remix-run/node";

import { logout } from "~/server/auth.server";

export async function action() {
  return await logout();
}

export async function loader() {
  return redirect("/");
}
