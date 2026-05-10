-- Classify existing Stay guide venues into first-class lodging fields.

with stay_text as (
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
          stop.booking_url,
          stop.official_url
        ),
        ' '
      )
    ) as searchable_text
  from public.venues venue
  join public.entry_stops stop on stop.venue_id = venue.id
  join public.entries entry on entry.id = stop.entry_id
  where entry.category = 'Stay'
    or stop.category = 'Stay'
  group by venue.id
),
classified as (
  select
    venue_id,
    case
      when searchable_text ~ '\mholiday\s+parks?\M' then 'holiday_park'::public.lodging_type
      when searchable_text ~ '\m(camp(ing|ground|site)?|glamp(ing)?)\M' then 'camping'::public.lodging_type
      when searchable_text ~ '\mresorts?\M' then 'resort'::public.lodging_type
      when searchable_text ~ '\mhostels?\M'
        or searchable_text like '%hostelworld%' then 'hostel'::public.lodging_type
      when searchable_text ~ '\m(aparthotel|apartment[- ]?hotel|serviced apartments?)\M' then 'apartment_hotel'::public.lodging_type
      when searchable_text ~ '\m(guest\s*houses?|guesthouses?|hostals?|bed\s+and\s+breakfast|b&b)\M' then 'guesthouse'::public.lodging_type
      when searchable_text ~ '\m(airbnb|vacation rentals?|short[- ]?term rentals?)\M' then 'airbnb'::public.lodging_type
      when searchable_text ~ '\m(hotels?|inn|suites?)\M' then 'hotel'::public.lodging_type
      else null
    end as lodging_type,
    array_remove(array[
      case when searchable_text ~ '\m(relax|relaxing|calm|restful|retreat|spa|wellness)\M' then 'relaxing' end,
      case when searchable_text ~ '\m(quiet|peaceful|low[- ]?key)\M' then 'quiet' end,
      case when searchable_text ~ '\m(lively|buzz|busy|energetic)\M' then 'lively' end,
      case when searchable_text ~ '\m(party|club|nightlife|bar\s+crawl)\M' then 'party' end,
      case when searchable_text ~ '\m(social|meet\s+people|communal|backpacker|hostels?)\M' then 'social' end,
      case when searchable_text ~ '\m(scenic|views?|rooftop|panoramic|lookout)\M' then 'scenic' end,
      case when searchable_text ~ '\m(beach|waterfront|seaside|coast|ocean)\M' then 'beach' end,
      case when searchable_text ~ '\m(nature|forest|mountain|park|lake|countryside|camp(ing|ground|site)?)\M' then 'nature' end,
      case when searchable_text ~ '\m(central|downtown|city\s+center|city\s+centre)\M' then 'central' end,
      case when searchable_text ~ '\m(budget|cheap|affordable|value|hostels?)\M' then 'budget' end,
      case when searchable_text ~ '\m(luxury|five[- ]?star|5[- ]?star|premium|resorts?)\M' then 'luxury' end,
      case when searchable_text ~ '\m(family|kids|children|holiday\s+parks?)\M' then 'family_friendly' end,
      case when searchable_text ~ '\m(romantic|couples?|honeymoon)\M' then 'romantic' end,
      case when searchable_text ~ '\m(work|cowork|business|desk|remote)\M' then 'work_friendly' end,
      case when searchable_text ~ '\m(design|boutique|stylish|architecture|minimalist)\M' then 'design' end,
      case when searchable_text ~ '\m(accessible|wheelchair|step[- ]?free)\M' then 'accessible' end,
      case when searchable_text ~ '\m(pet[- ]?friendly|dogs?\s+welcome)\M' then 'pet_friendly' end
    ]::text[], null) as attribute_tags
  from stay_text
)
update public.venues venue
set
  venue_kind = 'lodging',
  lodging_type = coalesce(classified.lodging_type, venue.lodging_type),
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
  jsonb_build_object('source', 'stay_venue_backfill')
from public.venues venue
join public.venue_tags tag on tag.slug = any(venue.attribute_tags)
where venue.venue_kind = 'lodging'
on conflict (venue_id, tag_id) do nothing;
