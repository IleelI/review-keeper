import { z } from "zod";

const filtersSchema = z.object({
  author: z.string().array(),
  category: z.string().array(),
  rating: z
    .union([
      z.literal("any-rating"),
      z.literal("low"),
      z.literal("medicore"),
      z.literal("high"),
    ])
    .optional(),
  reactions: z
    .union([
      z.literal("any-reaction"),
      z.literal("popular"),
      z.literal("known"),
      z.literal("unknown"),
    ])
    .optional(),
});
type FiltersSchema = z.infer<typeof filtersSchema>;

export const backendFiltersSchema = filtersSchema
  .pick({
    rating: true,
    reactions: true,
  })
  .extend({
    author: z.string().optional(),
    category: z.string().optional(),
  });

const ratingFilterOpions: {
  label: string;
  value: Exclude<FiltersSchema["rating"], undefined>;
}[] = [
  { label: "Any rating", value: "any-rating" },
  { label: "Low", value: "low" },
  { label: "Medicore", value: "medicore" },
  { label: "High", value: "high" },
];

const reactionsFilterOptions: {
  label: string;
  value: Exclude<FiltersSchema["reactions"], undefined>;
}[] = [
  { label: "Any reaction", value: "any-reaction" },
  { label: "Unknown", value: "unknown" },
  { label: "Known", value: "known" },
  { label: "Popular", value: "popular" },
];

export { filtersSchema, ratingFilterOpions, reactionsFilterOptions };
export type { FiltersSchema };
