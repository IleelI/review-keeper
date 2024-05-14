import { useCallback, useMemo, useState } from "react";

import { Combobox, type ComboboxItem } from "./Combobox";

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

  return (
    <main className="flex flex-col gap-16">
      <h1>Playground</h1>

      <article>
        <h2>Multiselect</h2>
        <Combobox>
          <Combobox.Trigger>
            <Combobox.Value placeholder="Select items...">
              {displayedValues.join(", ")}
            </Combobox.Value>
            <Combobox.TriggerIcon />
          </Combobox.Trigger>
          <Combobox.Content>
            <Combobox.Search
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items..."
              value={query}
            />
            {filteredItems.length ? (
              filteredItems.map(({ name, value }) => (
                <Combobox.Item
                  key={value}
                  onClick={() => handleValueChange(value)}
                >
                  {name}
                  {values.includes(value) ? <Combobox.ItemIndicator /> : null}
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
