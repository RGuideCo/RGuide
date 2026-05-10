-- Classify existing Nightlife guide venues into first-class nightlife fields.

with nightlife_text as (
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
  where entry.category = 'Nightlife'
    or stop.category = 'Nightlife'
  group by venue.id
),
classified as (
  select
    venue_id,
    case
      when searchable_text ~ '\mdive\s+bars?\M' then 'dive_bar'::public.nightlife_type
      when searchable_text ~ '\m(sports?\s+bars?|watch\s+the\s+game|screen(s|ing)?)\M' then 'sports_bar'::public.nightlife_type
      when searchable_text ~ '\m(gaming\s+bars?|arcade|board\s+game|pool\s+table|darts?)\M' then 'gaming_bar'::public.nightlife_type
      when searchable_text ~ '\m(cocktail|mixology|speakeasy)\M' then 'cocktail_bar'::public.nightlife_type
      when searchable_text ~ '\m(pubs?|public\s+house)\M' then 'pub'::public.nightlife_type
      when searchable_text ~ '\m(wine\s+bars?|natural\s+wine)\M' then 'wine_bar'::public.nightlife_type
      when searchable_text ~ '\m(beer\s+bars?|brewery|taproom|craft\s+beer)\M' then 'beer_bar'::public.nightlife_type
      when searchable_text ~ '\mrooftop\M' then 'rooftop_bar'::public.nightlife_type
      when searchable_text ~ '\m(comedy\s+clubs?|stand[- ]?up)\M' then 'comedy_club'::public.nightlife_type
      when searchable_text ~ '\mconcert\s+halls?\M' then 'concert_hall'::public.nightlife_type
      when searchable_text ~ '\m(theatres?|theaters?|stage|show)\M' then 'theatre'::public.nightlife_type
      when searchable_text ~ '\m(live\s+music|jazz\s+club|music\s+venue)\M' then 'live_music_venue'::public.nightlife_type
      when searchable_text ~ '\m(clubs?|nightclubs?|dance\s+floor|dj)\M' then 'club'::public.nightlife_type
      when searchable_text ~ '\mkaraoke\M' then 'karaoke_bar'::public.nightlife_type
      when searchable_text ~ '\mcasino\M' then 'casino'::public.nightlife_type
      when searchable_text ~ '\mlounge\M' then 'lounge'::public.nightlife_type
      when searchable_text ~ '\mbars?\M' then 'cocktail_bar'::public.nightlife_type
      else 'other'::public.nightlife_type
    end as nightlife_type,
    price_label::public.price_tier as price_tier,
    array_remove(array[
      case when searchable_text ~ '\mhouse\M' then 'house' end,
      case when searchable_text ~ '\mtechno\M' then 'techno' end,
      case when searchable_text ~ '\m(electronic|edm|dance\s+music)\M' then 'electronic' end,
      case when searchable_text ~ '\m(hip[- ]?hop|rap)\M' then 'hip_hop' end,
      case when searchable_text ~ '\m(r&b|rnb)\M' then 'r_and_b' end,
      case when searchable_text ~ '\m(latin|reggaeton|salsa|bachata|cumbia)\M' then 'latin' end,
      case when searchable_text ~ '\mjazz\M' then 'jazz' end,
      case when searchable_text ~ '\mblues\M' then 'blues' end,
      case when searchable_text ~ '\m(rock|indie)\M' then 'rock' end,
      case when searchable_text ~ '\mpop\M' then 'pop' end,
      case when searchable_text ~ '\mdisco\M' then 'disco' end,
      case when searchable_text ~ '\mfunk\M' then 'funk' end,
      case when searchable_text ~ '\msoul\M' then 'soul' end,
      case when searchable_text ~ '\m(reggae|dancehall)\M' then 'reggae' end,
      case when searchable_text ~ '\mmetal\M' then 'metal' end,
      case when searchable_text ~ '\mpunk\M' then 'punk' end,
      case when searchable_text ~ '\m(classical|orchestra|symphony)\M' then 'classical' end,
      case when searchable_text ~ '\mflamenco\M' then 'flamenco' end,
      case when searchable_text ~ '\mfado\M' then 'fado' end,
      case when searchable_text ~ '\msamba\M' then 'samba' end,
      case when searchable_text ~ '\mtango\M' then 'tango' end
    ]::text[], null) as music_genres,
    array_remove(array[
      case when searchable_text ~ '\m(cheap|budget|affordable|dive)\M' or price_label = '$' then 'cheap_drinks' end,
      case when searchable_text ~ '\m(premium|luxury|expensive|champagne|high[- ]?end)\M' or price_label in ('$$$', '$$$$') then 'premium_drinks' end,
      case when searchable_text ~ '\m(dance\s+floor|dancing|club|dj)\M' then 'dance_floor' end,
      case when searchable_text ~ '\m(late[- ]?late|after[- ]?hours|all[- ]?night|late\s+night)\M' then 'late_late' end,
      case when searchable_text ~ '\m(low[- ]?key|quiet|chill|conversation|calm)\M' then 'low_key_nightlife' end,
      case when searchable_text ~ '\m(lively|buzz|busy|scene|energetic|packed)\M' then 'lively_nightlife' end,
      case when searchable_text ~ '\m(party|wild|club|nightclub)\M' then 'party_nightlife' end,
      case when searchable_text ~ '\m(romantic|date|couples?|intimate)\M' then 'romantic_nightlife' end,
      case when searchable_text ~ '\m(scenic|view|views|rooftop|waterfront|terrace|patio|skyline)\M' then 'scenic_nightlife' end,
      case when searchable_text ~ '\m(local|neighborhood|regulars?|dive)\M' then 'local_bar' end,
      case when searchable_text ~ '\m(speakeasy|hidden|reservation[- ]?only)\M' then 'speakeasy' end,
      case when searchable_text ~ '\m(craft\s+cocktail|cocktail|mixology)\M' then 'craft_cocktails' end,
      case when searchable_text ~ '\m(craft\s+beer|brewery|taproom)\M' then 'craft_beer' end,
      case when searchable_text ~ '\m(natural\s+wine|wine\s+bar)\M' then 'natural_wine' end,
      case when searchable_text ~ '\m(live\s+music|jazz|band|concert)\M' then 'live_music' end,
      case when searchable_text ~ '\m(dj|club\s+night|sets?)\M' then 'dj_sets' end,
      case when searchable_text ~ '\m(comedy|stand[- ]?up)\M' then 'comedy' end,
      case when searchable_text ~ '\m(theatre|theater|stage|show|performance)\M' then 'theatre_show' end,
      case when searchable_text ~ '\mkaraoke\M' then 'karaoke' end,
      case when searchable_text ~ '\m(arcade|games?|pool\s+table|darts?|gaming)\M' then 'games' end,
      case when searchable_text ~ '\m(sports?|watch\s+the\s+game|screen(s|ing)?)\M' then 'sports_screening' end,
      case when searchable_text ~ '\m(queer|lgbtq|gay\s+bar)\M' then 'queer_friendly' end,
      case when searchable_text ~ '\m(tourist|visitor|traveler|traveller)\M' then 'tourist_friendly' end,
      case when searchable_text ~ '\m(dressy|upscale|polished|smart\s+casual)\M' then 'dressy' end,
      case when searchable_text ~ '\m(casual|no[- ]?fuss|pub|dive)\M' then 'casual_nightlife' end,
      case when searchable_text ~ '\m(reservation|guestlist|tickets?|book)\M' then 'reservation_recommended_nightlife' end,
      case when searchable_text ~ '\m(walk[- ]?in|drop[- ]?in|no\s+reservation)\M' then 'walk_in_friendly_nightlife' end
    ]::text[], null) as attribute_tags
  from nightlife_text
)
update public.venues venue
set
  venue_kind = case
    when venue.venue_kind = 'other' then 'nightlife'
    else venue.venue_kind
  end,
  venue_kinds = array(
    select distinct kind
    from unnest(venue.venue_kinds || array['nightlife'::public.venue_kind]) as kind
    order by kind
  ),
  nightlife_type = coalesce(classified.nightlife_type, venue.nightlife_type),
  music_genres = array(
    select distinct genre
    from unnest(venue.music_genres || classified.music_genres) as genre
    order by genre
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
  jsonb_build_object('source', 'nightlife_venue_backfill')
from public.venues venue
join public.venue_tags tag on tag.slug = any(venue.attribute_tags)
where venue.venue_kind = 'nightlife'
  or 'nightlife' = any(venue.venue_kinds)
on conflict (venue_id, tag_id) do nothing;
