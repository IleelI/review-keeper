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
              className="flex items-center rounded-lg border border-neutral-400 bg-transparent px-2.5 py-1.5 text-neutral-700 placeholder:text-neutral-400"
              id="title"
              name="title"
              placeholder="ex. Review Keeper is it worth it?"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-neutral-700" htmlFor="category">
              Category
            </label>
            <span className="relative after:pointer-events-none after:absolute after:right-3 after:top-1/2 after:-translate-y-1/2 after:content-['↓']">
              <select
                className="flex w-full appearance-none items-center rounded-lg border border-neutral-400 bg-transparent py-1.5 pl-2.5 pr-8 text-neutral-700"
                id="category"
                name="category"
              >
                <option value="uncategorised">Uncategorised</option>
                <option value="electronics">Electronics</option>
                <option value="software">Software</option>
              </select>
            </span>
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
                className="flex w-full items-center rounded-lg border border-neutral-400 bg-transparent px-2.5 py-1.5 text-neutral-700 placeholder:text-neutral-400"
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
                className="flex w-full items-center rounded-lg border border-neutral-400 bg-transparent px-2.5 py-1.5 text-neutral-700 placeholder:text-neutral-400"
                placeholder="ex. 100"
              />
            </div>
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-neutral-700" htmlFor="content">
              Review <span className="text-error-700">*</span>
            </label>
            <textarea
              className="flex max-h-[480px] min-h-[240px] resize-y items-center rounded-lg border border-neutral-400 bg-transparent p-2.5 text-neutral-700 placeholder:text-neutral-400"
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
