-- Pin search_path for the destination category strength validation trigger.

alter function public.validate_destination_category_neighborhood_strength()
set search_path = '';
