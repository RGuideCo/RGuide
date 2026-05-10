-- Classify existing Food guide venues into first-class food fields.

with food_text as (
  select
    venue.id as venue_id,
    lower(
      string_agg(
        concat_ws(
          ' ',
          stop.name,
          stop.description,
          stop.category,
          stop.price_label,
          stop.price_source,
          stop.booking_url,
          stop.official_url
        ),
        ' '
      )
    ) as searchable_text,
    max(stop.price_label) filter (where stop.price_label in ('$', '$$', '$$$', '$$$$')) as price_label
  from public.venues venue
  join public.entry_stops stop on stop.venue_id = venue.id
  join public.entries entry on entry.id = stop.entry_id
  where entry.category = 'Food'
    or stop.category = 'Food'
  group by venue.id
),
classified as (
  select
    venue_id,
    case
      when searchable_text ~ '\mfood\s+trucks?\M' then 'food_truck'::public.food_service_type
      when searchable_text ~ '\mfood\s+carts?\M' then 'food_cart'::public.food_service_type
      when searchable_text ~ '\m(stall|stand|kiosk|market\s+counter)\M' then 'stall'::public.food_service_type
      when searchable_text ~ '\m(fast\s+food|quick\s+service|counter[- ]?service)\M' then 'fast_food'::public.food_service_type
      when searchable_text ~ '\m(cafe|café|coffee|espresso|bakery|patisserie|pastry)\M' then 'cafe'::public.food_service_type
      else 'restaurant'::public.food_service_type
    end as food_service_type,
    price_label::public.price_tier as price_tier,
    array_remove(array[
      case when searchable_text ~ '\mamerican\M' then 'american' end,
      case when searchable_text ~ '\m(argentine|argentinian|parrilla|asado)\M' then 'argentine' end,
      case when searchable_text ~ '\masian\M' then 'asian' end,
      case when searchable_text ~ '\m(bakery|bakeries|pastry|patisserie|bread)\M' then 'bakery' end,
      case when searchable_text ~ '\m(barbecue|bbq|smoked\s+meat)\M' then 'barbecue' end,
      case when searchable_text ~ '\mbistro\M' then 'bistro' end,
      case when searchable_text ~ '\m(brazilian|churrasco|boteco)\M' then 'brazilian' end,
      case when searchable_text ~ '\m(british|english|pub\s+food)\M' then 'british' end,
      case when searchable_text ~ '\m(cafe|café|coffee|espresso)\M' then 'cafe' end,
      case when searchable_text ~ '\m(caribbean|jamaican|haitian)\M' then 'caribbean' end,
      case when searchable_text ~ '\mcatalan\M' then 'catalan' end,
      case when searchable_text ~ '\m(chinese|cantonese|sichuan|szechuan|dim\s+sum)\M' then 'chinese' end,
      case when searchable_text ~ '\m(colombian|arepa)\M' then 'colombian' end,
      case when searchable_text ~ '\m(contemporary|modern)\M' then 'contemporary' end,
      case when searchable_text ~ '\mcuban\M' then 'cuban' end,
      case when searchable_text ~ '\m(dessert|ice\s+cream|gelato|chocolate)\M' then 'dessert' end,
      case when searchable_text ~ '\mecuadorian\M' then 'ecuadorian' end,
      case when searchable_text ~ '\memirati\M' then 'emirati' end,
      case when searchable_text ~ '\mfilipino\M' then 'filipino' end,
      case when searchable_text ~ '\m(french|brasserie|boulangerie)\M' then 'french' end,
      case when searchable_text ~ '\m(german|biergarten|beer\s+hall)\M' then 'german' end,
      case when searchable_text ~ '\mgreek\M' then 'greek' end,
      case when searchable_text ~ '\mguatemalan\M' then 'guatemalan' end,
      case when searchable_text ~ '\m(hawaiian|poke|plate\s+lunch)\M' then 'hawaiian' end,
      case when searchable_text ~ '\m(indian|south\s+asian|curry|dosa)\M' then 'indian' end,
      case when searchable_text ~ '\mindonesian\M' then 'indonesian' end,
      case when searchable_text ~ '\m(italian|pizza|pizzeria|pasta|trattoria|osteria)\M' then 'italian' end,
      case when searchable_text ~ '\m(japanese|sushi|ramen|izakaya|yakitori|omakase)\M' then 'japanese' end,
      case when searchable_text ~ '\m(korean|bbq|barbecue)\M' then 'korean' end,
      case when searchable_text ~ '\mlatin\s+american\M' then 'latin_american' end,
      case when searchable_text ~ '\mmalaysian\M' then 'malaysian' end,
      case when searchable_text ~ '\mmediterranean\M' then 'mediterranean' end,
      case when searchable_text ~ '\m(mexican|taco|taqueria|mezcal)\M' then 'mexican' end,
      case when searchable_text ~ '\m(middle\s+eastern|levantine|falafel|shawarma)\M' then 'middle_eastern' end,
      case when searchable_text ~ '\mnikkei\M' then 'nikkei' end,
      case when searchable_text ~ '\m(peranakan|nyonya)\M' then 'peranakan' end,
      case when searchable_text ~ '\m(peruvian|ceviche|pisco)\M' then 'peruvian' end,
      case when searchable_text ~ '\m(portuguese|tasca|pastel\s+de\s+nata)\M' then 'portuguese' end,
      case when searchable_text ~ '\m(seafood|fish|oyster|ceviche)\M' then 'seafood' end,
      case when searchable_text ~ '\m(singaporean|hawker)\M' then 'singaporean' end,
      case when searchable_text ~ '\m(spanish|tapas|pintxos)\M' then 'spanish' end,
      case when searchable_text ~ '\m(steakhouse|steak)\M' then 'steakhouse' end,
      case when searchable_text ~ '\m(street\s+food|hawker|stall|cart|food\s+truck)\M' then 'street_food' end,
      case when searchable_text ~ '\mthai\M' then 'thai' end,
      case when searchable_text ~ '\m(turkish|kebab|meyhane)\M' then 'turkish' end,
      case when searchable_text ~ '\mvegan\M' then 'vegan' end,
      case when searchable_text ~ '\mvegetarian\M' then 'vegetarian' end,
      case when searchable_text ~ '\m(vietnamese|pho|banh\s+mi)\M' then 'vietnamese' end
    ]::text[], null) as cuisine_types,
    array_remove(array[
      case when searchable_text ~ '\m(casual|easygoing|low[- ]?key|stall|food\s+truck|food\s+cart|fast\s+food)\M' then 'casual' end,
      case when searchable_text ~ '\m(date\s+night|date|romantic|couples?)\M' then 'date_night' end,
      case when searchable_text ~ '\m(date\s+night|romantic|couples?)\M' then 'romantic_food' end,
      case when searchable_text ~ '\m(group|shared|family[- ]?style|large\s+tables?)\M' then 'group_friendly' end,
      case when searchable_text ~ '\m(solo|counter|bar\s+seat|counter\s+seat)\M' then 'solo_friendly' end,
      case when searchable_text ~ '\m(family|kids|children)\M' then 'family_friendly_food' end,
      case when searchable_text ~ '\m(local\s+favorite|neighborhood|regulars?)\M' then 'local_favorite' end,
      case when searchable_text ~ '\m(destination|worth\s+planning|michelin|world''?s\s+50|la\s+liste)\M' then 'destination_dining' end,
      case when searchable_text ~ '\m(fine\s+dining|michelin|tasting\s+menu|chef[- ]?led|omakase)\M' then 'fine_dining' end,
      case when searchable_text ~ '\m(tasting\s+menu|omakase)\M' then 'tasting_menu' end,
      case when searchable_text ~ '\m(street\s+food|hawker|stall|cart|food\s+truck)\M' then 'street_food' end,
      case when searchable_text ~ '\m(market|food\s+hall)\M' then 'market' end,
      case when searchable_text ~ '\m(late[- ]?night|after[- ]?hours|all[- ]?night)\M' then 'late_night' end,
      case when searchable_text ~ '\m(breakfast|morning)\M' then 'breakfast' end,
      case when searchable_text ~ '\mbrunch\M' then 'brunch' end,
      case when searchable_text ~ '\m(coffee|espresso|cafe|café)\M' then 'coffee' end,
      case when searchable_text ~ '\m(bakery|patisserie|pastry|bread|dessert)\M' then 'bakery' end,
      case when searchable_text ~ '\m(seafood|fish|oyster|ceviche)\M' then 'seafood' end,
      case when searchable_text ~ '\mvegetarian\M' then 'vegetarian_friendly' end,
      case when searchable_text ~ '\mvegan\M' then 'vegan_friendly' end,
      case when searchable_text ~ '\mgluten[- ]?free\M' then 'gluten_free_friendly' end,
      case when searchable_text ~ '\m(reservation|book|booking|hard\s+to\s+get)\M' then 'reservation_recommended' end,
      case when searchable_text ~ '\m(walk[- ]?in|no\s+reservation|counter)\M' then 'walk_in_friendly' end,
      case when searchable_text ~ '\m(scenic|view|views|rooftop|waterfront|terrace|patio)\M' then 'scenic_food' end,
      case when searchable_text ~ '\m(lively|buzz|busy|scene|energetic)\M' then 'lively_food' end,
      case when searchable_text ~ '\m(quiet|calm|peaceful)\M' then 'quiet_food' end,
      case when searchable_text ~ '\m(budget|cheap|affordable|value)\M' or price_label = '$' then 'budget_food' end,
      case when searchable_text ~ '\m(splurge|expensive|luxury|premium)\M' or price_label in ('$$$', '$$$$') then 'splurge_food' end
    ]::text[], null) as attribute_tags
  from food_text
)
update public.venues venue
set
  venue_kind = 'food_drink',
  food_service_type = coalesce(classified.food_service_type, venue.food_service_type),
  cuisine_types = array(
    select distinct cuisine
    from unnest(venue.cuisine_types || classified.cuisine_types) as cuisine
    order by cuisine
  ),
  price_tier = coalesce(classified.price_tier, venue.price_tier),
  attribute_tags = array(
    select distinct tag
    from unnest(venue.attribute_tags || classified.attribute_tags) as tag
    order by tag
  ),
  updated_at = now()
from classified
where classified.venue_id = venue.id;

insert into public.venue_taggings (venue_id, tag_id, confidence, raw_metadata)
select
  venue.id,
  tag.id,
  0.700,
  jsonb_build_object('source', 'food_venue_backfill')
from public.venues venue
join public.venue_tags tag on tag.slug = any(venue.attribute_tags)
where venue.venue_kind = 'food_drink'
on conflict (venue_id, tag_id) do nothing;
