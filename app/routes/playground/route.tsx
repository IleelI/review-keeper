import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

import Button from "~/components/atoms/Button";
import Checkbox from "~/components/atoms/Checkbox";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));

  return null;
};

const Playground = () => {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-10 px-8 py-6 lg:mx-auto lg:max-w-screen-sm lg:items-center lg:justify-center">
      <h1 className="text-3xl font-bold">Playground</h1>

      <Form action="/playground" className="flex flex-col gap-4" method="post">
        <div className="flex items-center gap-3">
          <Checkbox id="newCheckbox" name="newCheckbox" />
          <label className="cursor-pointer" htmlFor="newCheckbox">
            Accept terms and conditions.
          </label>
        </div>

        <Button type="submit">Submit</Button>
      </Form>
    </main>
  );
};

export default Playground;
