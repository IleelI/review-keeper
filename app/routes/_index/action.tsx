import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formDataRaw = await request.formData();
  console.log(formDataRaw);
  const form = Object.fromEntries(formDataRaw);
  console.log(form);
  return null;
};
