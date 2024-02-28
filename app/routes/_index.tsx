import { type MetaFunction } from "@remix-run/node";

import useUser from "~/hooks/useUser/useUser";

export const meta: MetaFunction = () => {
  return [
    { title: "Review Keeper" },
    { name: "description", content: "Welcome to Review Keeper!" },
  ];
};

export default function Index() {
  const user = useUser();

  return <main>{user ? user.username : "No user"}</main>;
}
