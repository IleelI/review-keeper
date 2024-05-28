export const ResultsSkeleton = () => (
  <ul className="grid auto-rows-[minmax(120px,1fr)] grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[minmax(200px,1fr)] lg:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
    {Array(9)
      .fill(null)
      .map((_, index) => (
        <li
          className="group grid h-full w-full animate-pulse grid-cols-1 grid-rows-[1fr_auto] gap-8 rounded-lg border border-neutral-200 bg-neutral-100 p-4 shadow transition dark:border-neutral-700 dark:bg-neutral-800"
          key={index}
        />
      ))}
  </ul>
);
