import { LoaderFunctionArgs, json } from "@remix-run/node";

import { requireUser } from "~/server/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

export default function Protected() {
  return (
    <div>
      <p>Protected resource</p>
    </div>
  );
}
