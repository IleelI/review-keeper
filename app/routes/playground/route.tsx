import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { ArrowSeparateVertical, Check, Search } from "iconoir-react";
import { useMemo, useRef, useState } from "react";

import Input from "~/components/atoms/Input";

interface ComboboxItem {
  name: string;
  value: string;
}
const items: ComboboxItem[] = [
  { name: "Item 1", value: "item-1" },
  { name: "Random Value 2", value: "randome value" },
  { name: "Curious Thing", value: "curious thing" },
  { name: "Item 2", value: "item-2" },
  { name: "Item 3", value: "item-3" },
];

interface ComboboxProps {
  isSingleChoice?: boolean;
}
// TODO - Abstract Combobox to fit compound component pattern.
const Combobox = ({ isSingleChoice = false }: ComboboxProps) => {
  const [values, setValues] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredItems = useMemo(
    () => items.filter(({ name }) => name.includes(query)),
    [query],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex min-h-[32px] w-96 items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 leading-none outline-none dark:border-neutral-700 dark:bg-neutral-800"
        role="combobox"
      >
        {values.size ? (
          <ul className="flex flex-wrap items-center gap-x-1 gap-y-2">
            {Array.from(values).map((value, index) => (
              <li className="text-sm leading-none" key={value}>
                {value}
                {index === values.size - 1 ? "" : ","}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500">Select items...</p>
        )}

        <ArrowSeparateVertical className="h-4 w-4" />
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent
          className="max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border border-neutral-200 bg-white ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 dark:border-neutral-700 dark:bg-neutral-800"
          collisionPadding={24}
          sideOffset={8}
        >
          <form className="flex items-center gap-1.5 border-b border-neutral-200 px-2 py-2 dark:border-neutral-700">
            <Search className="h-4 w-4" />
            <Input
              className="border-none p-0 leading-none"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search options..."
              ref={inputRef}
              value={query}
            />
          </form>

          {filteredItems.length ? (
            <ul className="flex flex-col gap-2 px-1 py-1.5">
              {filteredItems.map(({ name, value }) => {
                const isSelected = values.has(name);

                const handleClick = () => {
                  isSingleChoice
                    ? isSelected
                      ? setValues(new Set([]))
                      : setValues(new Set([name]))
                    : setValues((oldValues) => {
                        const newValues = new Set(oldValues);
                        isSelected
                          ? newValues.delete(name)
                          : newValues.add(name);
                        return newValues;
                      });
                };

                return (
                  <li key={value}>
                    <button
                      className="relative w-full rounded px-1.5 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      onClick={handleClick}
                    >
                      {name}
                      {isSelected ? (
                        <Check className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-2" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <section className="flex flex-col items-center justify-center gap-1 px-3 py-4">
              <h2 className="font-semibold text-neutral-800 dark:text-neutral-200">
                No result found
              </h2>
              <h3 className="text-sm text-neutral-600 dark:text-neutral-400">
                You can try changing your search input
              </h3>
            </section>
          )}
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

const PlaygroundPage = () => {
  return (
    <main className="flex flex-col gap-16">
      <h1>Playground</h1>

      <article>
        <h2>Multiselect</h2>
        <Combobox isSingleChoice />
      </article>
    </main>
  );
};

export default PlaygroundPage;
