# Category Insights And Neighborhood Strength Format

Use this format when a city/category needs better left-pane notes or ranked neighborhoods.

## Source Of Truth

Category notes and researched neighborhood strengths belong in Supabase destination content, not in guide render payloads and not as permanent React config.

Primary schema:

- `destination_category_insights`: one active row per `destination_id`, category, and locale. The `destination_id` can point to a city or a neighborhood.
- `destination_category_insight_chips`: clickable filter chips attached to an insight. Use `filter_kind = 'cuisine'` for food cuisine chips and `filter_kind = 'subcategory'` for category chips.
- `destination_category_insight_notes`: structured note rows attached to an insight. Use short labels and concrete planning copy.
- `destination_category_neighborhood_strengths`: researched parent-destination to child-neighborhood scores for a category and field key.

Runtime views:

- `active_destination_category_insights`
- `active_destination_category_neighborhood_strengths`

Runtime loader:

- `src/lib/destination-descriptions.ts` hydrates city and neighborhood objects with `categoryInsights` and `categoryNeighborhoodStrengths`.

The React files below are fallback defaults and prototype helpers only. When Supabase has rows for a city or neighborhood, those rows should win.

## Category Notes

Fallback file: `src/components/home/split-screen/category-insights.ts`

Preferred data shape in Supabase:

```sql
-- city-level Food notes
insert into public.destination_category_insights (
  destination_id,
  category,
  locale,
  label
)
select id, 'Food', 'en', 'Food notes'
from public.destinations
where legacy_id = 'city:japan:tokyo';
```

Add notes and chips as child rows:

```sql
insert into public.destination_category_insight_notes (
  insight_id,
  note_key,
  label,
  body,
  sort_order
)
values
  (:insight_id, 'breakfast', 'Breakfast', 'Concrete city-specific breakfast note.', 10),
  (:insight_id, 'lunch', 'Lunch', 'Concrete city-specific lunch note.', 20),
  (:insight_id, 'dinner', 'Dinner', 'Concrete city-specific dinner note.', 30);

insert into public.destination_category_insight_chips (
  insight_id,
  chip_slug,
  label,
  filter_kind,
  filter_value,
  sort_order
)
values
  (:insight_id, 'sushi', 'Sushi', 'cuisine', 'Sushi', 10),
  (:insight_id, 'ramen', 'Ramen', 'cuisine', 'Ramen', 20);
```

Fallback TypeScript shape:

```ts
cityId: {
  Category: {
    label: "Category notes",
    notes: [
      { label: "Short label", body: "Concrete city-specific planning note." },
      { label: "Short label", body: "Another note tied to neighborhoods, timing, routing, or booking." },
    ],
  },
}
```

Guidelines:
- Use 2-3 notes per category.
- Avoid generic advice that could describe any city.
- Mention the actual local planning logic: neighborhoods, station areas, timing, booking constraints, weather, price, or transit.
- Food can also use selected cuisine notes through `foodCuisineNeedToKnowNotes`; long term, these should become category insight rows keyed by destination and cuisine/field.
- For neighborhood-specific category guidance, attach the insight row to the neighborhood destination, not the parent city.

## Neighborhood Strength

Fallback file: `src/components/home/split-screen/neighborhood-strength.ts`

Preferred Supabase shape:

```sql
insert into public.destination_category_neighborhood_strengths (
  parent_destination_id,
  neighborhood_destination_id,
  category,
  field_key,
  score,
  rationale,
  source_urls
)
select
  city.id,
  neighborhood.id,
  'Nightlife',
  'cocktail bar',
  8.6,
  'Polished cocktail-room strength and serious drinks rather than all-purpose party energy.',
  array['https://source.example']
from public.destinations city
join public.destinations neighborhood
  on neighborhood.legacy_id = 'neighborhood:japan:tokyo:tokyo:ginza'
where city.legacy_id = 'city:japan:tokyo';
```

Add researched category weights in `cityCategoryResearchStrengths`:

```ts
cityId: {
  Category: {
    methodology: "How the score was decided.",
    sourceUrls: ["https://primary-or-useful-source.example"],
    fields: {
      default: {
        rationale: "What default means for this category.",
        scores: {
          neighborhood: 9.2,
        },
      },
      subcategory: {
        rationale: "What this subcategory score measures.",
        scores: {
          neighborhood: 8.4,
        },
      },
    },
  },
}
```

Score scale:
- `9-10`: city-defining strength for that category.
- `7-8`: strong and useful for most travelers.
- `5-6`: good but narrower or situational.
- Below `5`: secondary for that category.

Ranking behavior:
- Research weight is primary.
- Existing guide coverage is secondary.
- If no research config exists yet, the UI falls back to guide coverage.

Field key guidance:
- Use `default` for general category strength.
- Use exact filter labels for subcategory/cuisine-specific strength, normalized to lowercase words in the app. Examples: `cocktail bar`, `dive bar`, `live music`, `sushi`, `hotels`, `museums`.
- Each score must have a rationale and source URLs when it is researched rather than pure guide-count fallback.
