import { CaretDown, CaretUp } from "@phosphor-icons/react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { LoaderFunction } from "@remix-run/node";
import { Form, NavLink } from "@remix-run/react";

import { requireUser } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return null;
};

export default function NewReview() {
  return (
    <main className="flex flex-col gap-6">
      <nav className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-950">New Review</h1>
        <ul className="flex items-center gap-1">
          <NavLink
            className="text-sm text-neutral-600 underline underline-offset-2"
            to="/"
          >
            Review Keeper
          </NavLink>
          <li className="text-sm text-neutral-600">→</li>
          <NavLink
            className="text-sm font-medium underline underline-offset-2 [&.active]:text-primary-600"
            to="/review/new"
          >
            New Review
          </NavLink>
        </ul>
      </nav>

      <Form className="flex flex-col gap-8">
        <fieldset className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-neutral-700" htmlFor="title">
              Title <span className="text-error-700">*</span>
            </label>
            <input
              className="flex items-center rounded-lg border border-neutral-300 bg-transparent px-2.5 py-1.5 text-neutral-700 placeholder:text-neutral-400"
              id="title"
              name="title"
              placeholder="ex. Review Keeper is it worth it?"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label.Root
              className="font-medium text-neutral-700"
              htmlFor="category"
            >
              Category
            </Label.Root>
            <Select.Root>
              <Select.Trigger
                className="flex items-center justify-between rounded-lg border border-neutral-300 bg-transparent px-2.5 py-1.5 text-neutral-700 placeholder:text-neutral-400"
                id="category"
              >
                <Select.Value placeholder="Select category" />
                <Select.Icon>
                  <CaretDown />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  className="max-h-[200px] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-700"
                  position="popper"
                  sideOffset={8}
                >
                  <Select.ScrollUpButton className="flex items-center justify-center border-b border-neutral-300 px-2.5 py-1.5">
                    <CaretUp />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="flex flex-col gap-2 rounded-lg">
                    <Select.Item
                      className="px-2.5 py-1.5 data-[highlighted]:bg-primary-600 data-[highlighted]:text-neutral-200"
                      value="item-1"
                    >
                      <Select.ItemText>Item 1</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      className="px-2.5 py-1.5 data-[highlighted]:bg-primary-600 data-[highlighted]:text-neutral-200"
                      value="item-2"
                    >
                      <Select.ItemText>Item 2</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex items-center justify-center border-t border-neutral-300 px-2.5 py-1.5">
                    <CaretDown />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-neutral-700"
                htmlFor="ratingValue"
              >
                Rating
              </label>
              <input
                className="flex w-full items-center rounded-lg border border-neutral-300 bg-transparent px-2.5 py-1.5 text-neutral-700 placeholder:text-neutral-400"
                id="ratingValue"
                name="ratingValue"
                placeholder="ex. 50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="font-medium text-neutral-700"
                htmlFor="ratingScale"
              >
                Rating Scale
              </label>
              <input
                className="flex w-full items-center rounded-lg border border-neutral-300 bg-transparent px-2.5 py-1.5 text-neutral-700 placeholder:text-neutral-400"
                id="ratingScale"
                name="ratingScale"
                placeholder="ex. 100"
              />
            </div>
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-neutral-700" htmlFor="content">
              Review <span className="text-error-700">*</span>
            </label>
            <textarea
              className="flex max-h-[480px] min-h-[240px] resize-y items-center rounded-lg border border-neutral-300 bg-transparent p-2.5 text-neutral-700 placeholder:text-neutral-400"
              id="content"
              name="content"
              placeholder="ex. Great experience, would recommend it again!"
            />
          </div>
        </fieldset>

        <nav className="flex items-center gap-4">
          <button
            className="flex items-center justify-center rounded-lg border border-neutral-700 px-4 py-2 font-bold text-neutral-700"
            type="button"
          >
            Save as draft
          </button>
          <button
            className="flex items-center justify-center rounded-lg border border-primary-700 bg-primary-700 px-4 py-2 font-bold text-neutral-200"
            type="submit"
          >
            Publish review
          </button>
        </nav>
      </Form>
    </main>
  );
}
