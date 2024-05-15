import { useCallback, useMemo, useState } from "react";

import { Combobox, type ComboboxItem } from "~/components/molecules/Combobox";

const items: ComboboxItem[] = [
  { name: "Item 1", value: "item-1" },
  { name: "Random Value 2", value: "randome value" },
  { name: "Curious Thing", value: "curious thing" },
  { name: "Item 2", value: "item-2" },
  { name: "Item 3", value: "item-3" },
];

const PlaygroundPage = () => {
  const [values, setValues] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredItems = useMemo(
    () =>
      items.filter(({ name }) =>
        name.toLowerCase().includes(query.toLocaleLowerCase()),
      ),
    [query],
  );

  const displayedValues = useMemo(
    () =>
      items
        .filter(({ value }) => values.includes(value))
        .map(({ name }) => name),
    [values],
  );

  const handleValueChange = useCallback((value: string) => {
    setValues((prev) =>
      prev.includes(value)
        ? prev.filter((prevValue) => prevValue !== value)
        : [...prev, value],
    );
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    open && setQuery("");
    setOpen(open);
  }, []);

  return (
    <main className="flex flex-col gap-16">
      <h1>Playground</h1>

      <article>
        <h2>Multiselect</h2>
        <Combobox open={open} onOpenChange={handleOpenChange}>
          <Combobox.Trigger className="w-80">
            <Combobox.Value placeholder="Select items...">
              {displayedValues.join(", ")}
            </Combobox.Value>
            <Combobox.TriggerIcon />
          </Combobox.Trigger>

          <Combobox.Content>
            <Combobox.Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {filteredItems.length ? (
              filteredItems.map(({ name, value }) => (
                <Combobox.Item
                  key={value}
                  onClick={() => handleValueChange(value)}
                >
                  {name}
                  <Combobox.ItemIndicator isSelected={values.includes(value)} />
                </Combobox.Item>
              ))
            ) : (
              <Combobox.EmptyContent />
            )}
          </Combobox.Content>
        </Combobox>
      </article>
    </main>
  );
};

export default PlaygroundPage;
