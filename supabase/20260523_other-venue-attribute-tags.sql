-- Add filterable attribute tags for non-food/stay/nightlife venues:
-- culture, nature/outdoors, activities, landmarks, retail, event venues,
-- transport, services, and broad route/essential stops.

insert into public.venue_tags (slug, label, tag_group, applies_to, description)
values
  ('museum', 'Museum', 'style', 'culture', 'Museum or collection-led cultural venue.'),
  ('gallery', 'Gallery', 'style', 'culture', 'Gallery, exhibition, or contemporary art stop.'),
  ('historic_site', 'Historic Site', 'style', 'culture', 'Strong historic context or heritage value.'),
  ('architecture', 'Architecture', 'style', 'culture', 'Architecture, design, or built-form interest.'),
  ('public_art', 'Public Art', 'style', 'culture', 'Public art, mural, sculpture, or street-art context.'),
  ('religious_site', 'Religious Site', 'style', 'culture', 'Church, cathedral, mosque, temple, synagogue, or sacred site.'),
  ('literary', 'Literary', 'style', 'culture', 'Literary, library, book, or writer-related stop.'),
  ('educational', 'Educational', 'style', 'culture', 'Strong learning, interpretation, or contextual value.'),
  ('family_culture', 'Family-Friendly', 'audience', 'culture', 'Useful culture stop for families or children.'),
  ('rainy_day', 'Rainy Day', 'setting', 'culture', 'Good indoor option for poor weather.'),
  ('free_entry', 'Free Entry', 'budget', 'culture', 'Free or commonly free to enter.'),
  ('ticketed', 'Ticketed', 'booking', 'culture', 'Ticketed entry or timed admission is likely.'),
  ('guided_tour', 'Guided Tour', 'booking', 'culture', 'Works especially well with a tour or guided context.'),
  ('quiet_culture', 'Quiet', 'vibe', 'culture', 'Calmer, slower, or contemplative cultural stop.'),
  ('immersive', 'Immersive', 'style', 'culture', 'Immersive, experiential, or hands-on cultural context.'),

  ('park', 'Park', 'style', 'outdoors', 'Park, square, or open public green space.'),
  ('garden', 'Garden', 'style', 'outdoors', 'Garden, botanical space, or landscaped grounds.'),
  ('waterfront', 'Waterfront', 'setting', 'outdoors', 'River, canal, lake, harbor, beach, or waterfront setting.'),
  ('scenic_view', 'Scenic View', 'setting', 'outdoors', 'Viewpoint, panorama, skyline, or lookout.'),
  ('walking_route', 'Walking Route', 'style', 'outdoors', 'Best experienced as a walk or route.'),
  ('hiking', 'Hiking', 'style', 'outdoors', 'Hike, trail, hill, or more active outdoor route.'),
  ('easy_walk', 'Easy Walk', 'style', 'outdoors', 'Easy or low-effort walk.'),
  ('cycling', 'Cycling', 'style', 'outdoors', 'Useful for cycling or bike routes.'),
  ('picnic', 'Picnic', 'style', 'outdoors', 'Good for a picnic or lingering outside.'),
  ('wildlife', 'Wildlife', 'style', 'outdoors', 'Wildlife, animals, birding, or nature watching.'),
  ('sunset', 'Sunset', 'setting', 'outdoors', 'Good sunset or golden-hour setting.'),
  ('family_outdoors', 'Family-Friendly', 'audience', 'outdoors', 'Good outdoor stop for families or children.'),
  ('active_outdoors', 'Active', 'vibe', 'outdoors', 'More active outdoor experience.'),
  ('nature_escape', 'Nature Escape', 'setting', 'outdoors', 'Feels like a nature break from the city.'),

  ('iconic_landmark', 'Iconic Landmark', 'style', 'landmark', 'Highly recognizable or symbolic landmark.'),
  ('historic_landmark', 'Historic Landmark', 'style', 'landmark', 'Landmark with strong historic importance.'),
  ('architectural_landmark', 'Architectural Landmark', 'style', 'landmark', 'Landmark known for architecture or design.'),
  ('monument', 'Monument', 'style', 'landmark', 'Monument, memorial, statue, or commemorative site.'),
  ('viewpoint', 'Viewpoint', 'setting', 'landmark', 'Landmark with notable view or panorama.'),
  ('photo_spot', 'Photo Spot', 'style', 'landmark', 'Strong visual/photo appeal.'),
  ('unesco', 'UNESCO', 'style', 'landmark', 'UNESCO-listed or UNESCO-adjacent heritage context.'),
  ('must_see', 'Must-See', 'style', 'landmark', 'High-priority landmark for many visitors.'),
  ('quick_stop', 'Quick Stop', 'style', 'landmark', 'Works as a short route stop.'),

  ('market_retail', 'Market', 'style', 'retail', 'Market, bazaar, flea market, or shopping hall.'),
  ('boutique', 'Boutique', 'style', 'retail', 'Boutique or independent shopping.'),
  ('vintage', 'Vintage', 'style', 'retail', 'Vintage, thrift, antique, or secondhand shopping.'),
  ('luxury_shopping', 'Luxury Shopping', 'budget', 'retail', 'Luxury, designer, or premium shopping.'),
  ('local_makers', 'Local Makers', 'style', 'retail', 'Local makers, crafts, or artisan goods.'),
  ('design_shopping', 'Design Shopping', 'style', 'retail', 'Design-led shop or home/design goods.'),
  ('bookstore', 'Bookstore', 'style', 'retail', 'Bookstore, books, print, or literary retail.'),
  ('shopping_street', 'Shopping Street', 'setting', 'retail', 'Shopping street or retail district.'),
  ('souvenir', 'Souvenir', 'style', 'retail', 'Useful for gifts or souvenirs.'),

  ('performance_venue', 'Performance Venue', 'style', 'event_venue', 'Performance, show, or programmed venue.'),
  ('sports_venue', 'Sports Venue', 'style', 'event_venue', 'Sports venue, stadium, arena, or match-day place.'),
  ('festival_site', 'Festival Site', 'style', 'event_venue', 'Festival, seasonal, or recurring activation site.'),
  ('ticketed_activity', 'Ticketed Activity', 'booking', 'event_venue', 'Ticketed or booked activity.'),
  ('family_activity', 'Family-Friendly', 'audience', 'event_venue', 'Activity suited to families or children.'),
  ('hands_on', 'Hands-On', 'style', 'event_venue', 'Workshop, class, interactive, or hands-on experience.'),
  ('adventure', 'Adventure', 'vibe', 'event_venue', 'Adventure or higher-energy activity.'),
  ('wellness_activity', 'Wellness', 'style', 'event_venue', 'Wellness, spa, bathhouse, or restorative activity.'),
  ('indoor_activity', 'Indoor Activity', 'setting', 'event_venue', 'Useful indoor activity.'),
  ('outdoor_activity', 'Outdoor Activity', 'setting', 'event_venue', 'Outdoor activity or open-air experience.'),

  ('transit_hub', 'Transit Hub', 'style', 'transport', 'Station, ferry terminal, airport, or major transit node.'),
  ('ferry', 'Ferry', 'style', 'transport', 'Ferry, boat crossing, or water transport.'),
  ('train', 'Train', 'style', 'transport', 'Train, rail, metro, or tram context.'),
  ('airport', 'Airport', 'style', 'transport', 'Airport or airport-linked transport.'),
  ('practical', 'Practical', 'style', 'service', 'Useful practical or logistics stop.')
on conflict (slug) do update set
  label = excluded.label,
  tag_group = excluded.tag_group,
  applies_to = excluded.applies_to,
  description = excluded.description,
  is_filterable = true,
  is_active = true;

with other_text as (
  select
    venue.id as venue_id,
    lower(
      string_agg(
        concat_ws(
          ' ',
          entry.category,
          stop.category,
          stop.name,
          stop.description,
          stop.price_label,
          stop.price_source,
          stop.booking_url,
          stop.official_url
        ),
        ' '
      )
    ) as searchable_text,
    bool_or(entry.category = 'Culture' or stop.category = 'Culture') as is_culture,
    bool_or(entry.category = 'Nature' or stop.category = 'Nature') as is_nature,
    bool_or(entry.category = 'Activities' or stop.category = 'Activities') as is_activity,
    bool_or(entry.category = 'Routes' or stop.category = 'Routes') as is_route,
    bool_or(entry.category = 'Essentials' or stop.category = 'Essentials') as is_essential
  from public.venues venue
  join public.entry_stops stop on stop.venue_id = venue.id
  join public.entries entry on entry.id = stop.entry_id
  where coalesce(entry.category, stop.category) not in ('Food', 'Nightlife', 'Stay')
    and stop.venue_id is not null
  group by venue.id
),
classified as (
  select
    venue_id,
    case
      when searchable_text ~ '\m(airport|station|terminal|ferry|train|metro|tram|bus|transit)\M'
        or is_essential then 'transport'::public.venue_kind
      when searchable_text ~ '\m(shop|shopping|market|boutique|vintage|bookstore|store|retail|souvenir|makers?)\M'
        then 'retail'::public.venue_kind
      when searchable_text ~ '\m(stadium|arena|theatre|theater|concert|performance|festival|show|tickets?|class|workshop|spa|bathhouse|tour)\M'
        or is_activity then 'event_venue'::public.venue_kind
      when searchable_text ~ '\m(landmark|monument|memorial|tower|bridge|palace|castle|cathedral|basilica|church|temple|mosque|synagogue|unesco|iconic)\M'
        then 'landmark'::public.venue_kind
      when is_nature
        or searchable_text ~ '\m(park|garden|beach|waterfront|river|canal|lake|harbor|harbour|trail|hike|walk|viewpoint|lookout|forest|mountain|hill|outdoor|nature)\M'
        then 'outdoors'::public.venue_kind
      when is_culture
        or searchable_text ~ '\m(museum|gallery|art|exhibition|historic|history|culture|library|architecture|public\s+art)\M'
        then 'culture'::public.venue_kind
      when is_route then 'outdoors'::public.venue_kind
      else 'other'::public.venue_kind
    end as venue_kind,
    array_remove(array[
      case when searchable_text ~ '\m(museum|collection|collections)\M' then 'museum' end,
      case when searchable_text ~ '\m(gallery|exhibition|contemporary\s+art)\M' then 'gallery' end,
      case when searchable_text ~ '\m(historic|history|heritage|old\s+town|ancient|archaeolog)\M' then 'historic_site' end,
      case when searchable_text ~ '\m(architecture|architectural|design|built\s+form)\M' then 'architecture' end,
      case when searchable_text ~ '\m(public\s+art|mural|sculpture|street\s+art)\M' then 'public_art' end,
      case when searchable_text ~ '\m(church|cathedral|basilica|mosque|temple|synagogue|chapel|sacred|religious)\M' then 'religious_site' end,
      case when searchable_text ~ '\m(literary|library|book|writer|poet)\M' then 'literary' end,
      case when searchable_text ~ '\m(learn|learning|educational|interpretation|context)\M' then 'educational' end,
      case when searchable_text ~ '\m(family|kids|children)\M' then 'family_culture' end,
      case when searchable_text ~ '\m(indoor|rainy|weather)\M' then 'rainy_day' end,
      case when searchable_text ~ '\m(free|no\s+ticket|open\s+access)\M' then 'free_entry' end,
      case when searchable_text ~ '\m(ticket|timed\s+entry|admission|book|booking|reservation)\M' then 'ticketed' end,
      case when searchable_text ~ '\m(tour|guided)\M' then 'guided_tour' end,
      case when searchable_text ~ '\m(quiet|calm|contemplative|slow)\M' then 'quiet_culture' end,
      case when searchable_text ~ '\m(immersive|interactive|experiential|hands[- ]?on)\M' then 'immersive' end,

      case when searchable_text ~ '\m(park|square|green\s+space)\M' then 'park' end,
      case when searchable_text ~ '\m(garden|botanical|landscaped)\M' then 'garden' end,
      case when searchable_text ~ '\m(waterfront|river|canal|lake|harbor|harbour|beach|coast|seaside)\M' then 'waterfront' end,
      case when searchable_text ~ '\m(view|views|viewpoint|lookout|panorama|skyline|scenic)\M' then 'scenic_view' end,
      case when searchable_text ~ '\m(walk|walking|route|stroll|promenade)\M' then 'walking_route' end,
      case when searchable_text ~ '\m(hike|hiking|trail|mountain|hill)\M' then 'hiking' end,
      case when searchable_text ~ '\m(easy|gentle|low[- ]?effort)\M' then 'easy_walk' end,
      case when searchable_text ~ '\m(cycling|bike|bicycle)\M' then 'cycling' end,
      case when searchable_text ~ '\m(picnic|lawns?)\M' then 'picnic' end,
      case when searchable_text ~ '\m(wildlife|bird|deer|animals?)\M' then 'wildlife' end,
      case when searchable_text ~ '\m(sunset|golden[- ]?hour)\M' then 'sunset' end,
      case when searchable_text ~ '\m(family|kids|children)\M' then 'family_outdoors' end,
      case when searchable_text ~ '\m(active|run|climb|sport|surf|swim|cycle)\M' then 'active_outdoors' end,
      case when searchable_text ~ '\m(nature|escape|forest|woods?|mountain|countryside)\M' then 'nature_escape' end,

      case when searchable_text ~ '\m(iconic|symbol|famous|must[- ]?see)\M' then 'iconic_landmark' end,
      case when searchable_text ~ '\m(historic|history|heritage)\M' then 'historic_landmark' end,
      case when searchable_text ~ '\m(architectural|architecture|design)\M' then 'architectural_landmark' end,
      case when searchable_text ~ '\m(monument|memorial|statue)\M' then 'monument' end,
      case when searchable_text ~ '\m(viewpoint|view|panorama|lookout)\M' then 'viewpoint' end,
      case when searchable_text ~ '\m(photo|photograph|visual|picturesque)\M' then 'photo_spot' end,
      case when searchable_text ~ '\munesco\M' then 'unesco' end,
      case when searchable_text ~ '\m(must[- ]?see|major|headline|unavoidable)\M' then 'must_see' end,
      case when searchable_text ~ '\m(quick|short|route\s+marker|orientation\s+point)\M' then 'quick_stop' end,

      case when searchable_text ~ '\m(market|bazaar|flea)\M' then 'market_retail' end,
      case when searchable_text ~ '\m(boutique|independent\s+shop)\M' then 'boutique' end,
      case when searchable_text ~ '\m(vintage|thrift|antique|secondhand)\M' then 'vintage' end,
      case when searchable_text ~ '\m(luxury|designer|premium)\M' then 'luxury_shopping' end,
      case when searchable_text ~ '\m(local\s+makers?|artisan|craft)\M' then 'local_makers' end,
      case when searchable_text ~ '\m(design\s+shop|homeware|design[- ]?led)\M' then 'design_shopping' end,
      case when searchable_text ~ '\m(bookstore|books?|print)\M' then 'bookstore' end,
      case when searchable_text ~ '\m(shopping\s+street|retail\s+district)\M' then 'shopping_street' end,
      case when searchable_text ~ '\m(souvenir|gift)\M' then 'souvenir' end,

      case when searchable_text ~ '\m(performance|show|stage|theatre|theater|concert)\M' then 'performance_venue' end,
      case when searchable_text ~ '\m(stadium|arena|sports?|match[- ]?day)\M' then 'sports_venue' end,
      case when searchable_text ~ '\m(festival|seasonal|activation)\M' then 'festival_site' end,
      case when searchable_text ~ '\m(ticket|book|booking|reservation)\M' then 'ticketed_activity' end,
      case when searchable_text ~ '\m(family|kids|children)\M' then 'family_activity' end,
      case when searchable_text ~ '\m(workshop|class|hands[- ]?on|interactive)\M' then 'hands_on' end,
      case when searchable_text ~ '\m(adventure|adrenaline|thrill)\M' then 'adventure' end,
      case when searchable_text ~ '\m(wellness|spa|bathhouse|thermal|restorative)\M' then 'wellness_activity' end,
      case when searchable_text ~ '\mindoor\M' then 'indoor_activity' end,
      case when searchable_text ~ '\m(outdoor|open[- ]?air)\M' then 'outdoor_activity' end,

      case when searchable_text ~ '\m(station|terminal|transit|transport|airport)\M' then 'transit_hub' end,
      case when searchable_text ~ '\mferry\M' then 'ferry' end,
      case when searchable_text ~ '\m(train|rail|metro|tram)\M' then 'train' end,
      case when searchable_text ~ '\mairport\M' then 'airport' end,
      case when searchable_text ~ '\m(practical|logistics|orientation|essential)\M' then 'practical' end
    ]::text[], null) as attribute_tags
  from other_text
)
update public.venues venue
set
  venue_kind = case
    when venue.venue_kind = 'other' then classified.venue_kind
    else venue.venue_kind
  end,
  venue_kinds = array(
    select distinct kind
    from unnest(venue.venue_kinds || array[classified.venue_kind]) as kind
    where kind is not null
    order by kind
  ),
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
  0.650,
  jsonb_build_object('source', 'other_venue_attribute_backfill')
from public.venues venue
join public.venue_tags tag on tag.slug = any(venue.attribute_tags)
where venue.venue_kind in ('culture', 'outdoors', 'event_venue', 'retail', 'transport', 'service', 'landmark', 'other')
   or venue.venue_kinds && array[
     'culture'::public.venue_kind,
     'outdoors'::public.venue_kind,
     'event_venue'::public.venue_kind,
     'retail'::public.venue_kind,
     'transport'::public.venue_kind,
     'service'::public.venue_kind,
     'landmark'::public.venue_kind,
     'other'::public.venue_kind
   ]
on conflict (venue_id, tag_id) do nothing;

create or replace view public.other_venues
with (security_invoker = true) as
select
  venue.id,
  venue.name,
  venue.slug,
  venue.city_id,
  city.name as city_name,
  venue.neighborhood_id,
  neighborhood.name as neighborhood_name,
  venue.venue_kind,
  venue.venue_kinds,
  venue.attribute_tags,
  venue.coordinates,
  venue.official_url,
  venue.source_metadata,
  venue.created_at,
  venue.updated_at
from public.venues venue
left join public.destinations city on city.id = venue.city_id
left join public.destinations neighborhood on neighborhood.id = venue.neighborhood_id
where venue.venue_kind in ('culture', 'outdoors', 'event_venue', 'retail', 'transport', 'service', 'landmark', 'other')
   or venue.venue_kinds && array[
     'culture'::public.venue_kind,
     'outdoors'::public.venue_kind,
     'event_venue'::public.venue_kind,
     'retail'::public.venue_kind,
     'transport'::public.venue_kind,
     'service'::public.venue_kind,
     'landmark'::public.venue_kind,
     'other'::public.venue_kind
   ];
