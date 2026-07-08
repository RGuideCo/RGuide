export type LeftPaneDefinitionTerm = {
  term: string;
  aliases?: string[];
  definition: string;
};

const tokyoDefinitionTerms: LeftPaneDefinitionTerm[] = [
  {
    term: "Izakaya",
    aliases: ["izakaya"],
    definition:
      "A casual Japanese drinking spot built around small plates, snacks, beer, sake, and after-work social energy.",
  },
  {
    term: "Yokocho",
    aliases: ["yokocho"],
    definition:
      "A narrow alley or cluster of tiny bars and food counters, usually best for short stops and compact late-night hopping.",
  },
  {
    term: "Kissaten",
    aliases: ["kissaten"],
    definition:
      "An old-school Japanese coffee shop, often quieter and more nostalgic than a modern cafe.",
  },
  {
    term: "Depachika",
    aliases: ["depachika"],
    definition:
      "The basement food hall of a department store, useful for bento, sweets, prepared foods, gifts, and quick meals.",
  },
  {
    term: "Omakase",
    aliases: ["omakase"],
    definition:
      "A chef-led meal where the restaurant chooses the sequence for you, common in sushi and other counter restaurants.",
  },
  {
    term: "Ramen",
    aliases: ["ramen"],
    definition:
      "Japanese noodle soup where broth, tare, noodles, and toppings define the shop style. Tokyo has many highly specialized counters.",
  },
  {
    term: "Sushi",
    aliases: ["sushi"],
    definition:
      "Vinegared rice with seafood or other toppings. In Tokyo it can mean quick counter sets, standing shops, conveyor spots, or reservation omakase.",
  },
  {
    term: "Yakitori",
    aliases: ["yakitori"],
    definition:
      "Charcoal-grilled chicken skewers, ordered piece by piece and often paired with beer, sake, or highballs.",
  },
  {
    term: "Tempura",
    aliases: ["tempura"],
    definition:
      "Seafood and vegetables fried in a light batter, often served as a focused counter meal or set lunch.",
  },
  {
    term: "Tonkatsu",
    aliases: ["tonkatsu"],
    definition:
      "Breaded pork cutlet, usually served with shredded cabbage, rice, miso soup, and sauce.",
  },
  {
    term: "Soba",
    aliases: ["soba"],
    definition:
      "Buckwheat noodles served hot or cold; useful for quick meals, classic shops, and lighter route food.",
  },
  {
    term: "Karaoke",
    aliases: ["karaoke"],
    definition:
      "Singing rooms or bars that act as late-night social infrastructure, especially after dinner or drinks.",
  },
  {
    term: "Yamanote",
    aliases: ["Yamanote"],
    definition:
      "Tokyo's loop rail line, useful as a mental spine for connecting major districts without zigzagging across the city.",
  },
  {
    term: "IC cards",
    aliases: ["IC cards", "IC card"],
    definition:
      "Rechargeable Japanese transit cards, such as Suica or PASMO, used for trains, buses, lockers, and many small purchases.",
  },
  {
    term: "Hotel bars",
    aliases: ["hotel bars", "hotel lounges"],
    definition:
      "Polished, view-driven, or service-led bars inside hotels. In Tokyo they can be destination rooms rather than just lobby drinks.",
  },
];

const cityLeftPaneDefinitionTerms: Record<string, LeftPaneDefinitionTerm[]> = {
  tokyo: tokyoDefinitionTerms,
  barcelona: [
    {
      term: "Churreria",
      aliases: ["churreria", "churrerias"],
      definition:
        "A shop or cafe specializing in churros, often paired with thick hot chocolate for breakfast or a sweet stop.",
    },
    {
      term: "Churros",
      aliases: ["churros"],
      definition:
        "Fried dough pastries, usually dipped in thick chocolate in Spain.",
    },
    {
      term: "Esmorzar de forquilla",
      aliases: ["esmorzar de forquilla"],
      definition:
        "Catalan for a hearty fork breakfast: a substantial morning meal, often savory, eaten at a table rather than grabbed on the go.",
    },
    {
      term: "Menu del dia",
      aliases: ["menu del dia", "menú del día"],
      definition:
        "Spain's weekday set lunch menu, usually a good-value multi-course meal served around midday.",
    },
    {
      term: "Paella",
      aliases: ["paella"],
      definition:
        "A Spanish rice dish usually cooked in a wide pan; in Barcelona it is generally better treated as a lunch plan.",
    },
    {
      term: "Bodega",
      aliases: ["bodega", "bodegas"],
      definition:
        "A wine shop, cellar, or old-school bar where vermouth, wine, preserved seafood, and simple snacks often matter more than polish.",
    },
    {
      term: "Tapas",
      aliases: ["tapas"],
      definition:
        "Small plates or snacks built for sharing, grazing, and moving through a meal in stages.",
    },
    {
      term: "Vermut",
      aliases: ["vermut", "vermouth"],
      definition:
        "The Catalan and Spanish vermouth ritual: a low-pressure early-evening drink often paired with olives, chips, anchovies, or conservas.",
    },
    {
      term: "Modernisme",
      aliases: ["Modernisme", "Modernist"],
      definition:
        "Catalan Art Nouveau, the design movement behind much of Barcelona's signature architecture, including Gaudi's work.",
    },
    {
      term: "Panot",
      aliases: ["panot", "panot flower tiles"],
      definition:
        "Barcelona's patterned sidewalk tiles, especially the flower design associated with the Eixample streetscape.",
    },
  ],
  madrid: [
    {
      term: "Tapas",
      aliases: ["tapas"],
      definition:
        "Small plates or snacks built for sharing, grazing, and moving through a meal in stages.",
    },
    {
      term: "Vermouth",
      aliases: ["vermouth", "vermut"],
      definition:
        "A fortified wine often served as an aperitif, especially before lunch or dinner with small salty snacks.",
    },
    {
      term: "Tortilla",
      aliases: ["tortilla", "tortillas"],
      definition:
        "In Spain, usually tortilla espanola: a thick potato-and-egg omelet served as a tapa, snack, or simple meal.",
    },
  ],
  paris: [
    {
      term: "Bistro",
      aliases: ["bistro", "bistros"],
      definition:
        "A small, usually informal French restaurant, often built around neighborhood cooking and a tight dining room.",
    },
    {
      term: "Brasserie",
      aliases: ["brasserie", "brasseries"],
      definition:
        "A larger, classic French dining room, often open long hours and useful for oysters, steak frites, wine, and polished casual meals.",
    },
    {
      term: "Cabaret",
      aliases: ["cabaret"],
      definition:
        "A staged nightlife format built around music, performance, revue, or variety acts rather than a standard bar night.",
    },
  ],
  london: [
    {
      term: "Pub",
      aliases: ["pub", "pubs"],
      definition:
        "A public house: London's everyday social room for drinks, casual meals, neighborhood rhythm, and low-pressure stops.",
    },
    {
      term: "Pre-theatre",
      aliases: ["pre-theatre", "pre-theater"],
      definition:
        "A meal or drink timed before an evening show, usually quick, central, and reservation-aware.",
    },
    {
      term: "Tube",
      aliases: ["Tube"],
      definition:
        "London's Underground rail network, useful as the main planning logic for late routes and cross-city movement.",
    },
  ],
  istanbul: [
    {
      term: "Meyhane",
      aliases: ["meyhane"],
      definition:
        "A Turkish tavern-style restaurant built around raki, meze, shared plates, conversation, and a long table rhythm.",
    },
    {
      term: "Meze",
      aliases: ["meze", "mezze"],
      definition:
        "Small shared dishes served before or alongside drinks and mains across Turkey and the eastern Mediterranean.",
    },
    {
      term: "Kebab",
      aliases: ["kebab"],
      definition:
        "Grilled or roasted meat dishes with many regional forms; in Istanbul it is a broad category, not one single plate.",
    },
    {
      term: "Bazaar",
      aliases: ["bazaar", "bazaars"],
      definition:
        "A covered or open market where shopping, bargaining, food, and everyday city culture overlap.",
    },
  ],
  amsterdam: [
    {
      term: "Pannenkoeken",
      aliases: ["pannenkoeken"],
      definition:
        "Dutch pancakes, usually larger and thinner than American pancakes, served sweet or savory.",
    },
    {
      term: "Broodjes",
      aliases: ["broodjes"],
      definition:
        "Dutch sandwiches, often simple, quick, and useful for lunch or market-adjacent meals.",
    },
    {
      term: "Haringhandels",
      aliases: ["haringhandels", "herring stands"],
      definition:
        "Herring stands or fish counters where Dutch-style raw herring and seafood snacks are served quickly.",
    },
    {
      term: "Rijsttafel",
      aliases: ["rijsttafel"],
      definition:
        "An Indonesian-Dutch feast of many small dishes served with rice, rooted in colonial-era dining culture.",
    },
    {
      term: "Bruine kroegen",
      aliases: ["bruine kroegen", "brown cafe", "brown cafes", "brown cafés"],
      definition:
        "Old Dutch brown cafes: cozy, wood-darkened neighborhood bars known for beer, conversation, and lived-in atmosphere.",
    },
    {
      term: "Grachtengordel",
      aliases: ["Grachtengordel"],
      definition:
        "Amsterdam's central canal belt, the historic ring of canals that carries much of the city's old architecture and charm.",
    },
    {
      term: "De Wallen",
      aliases: ["De Wallen"],
      definition:
        "Amsterdam's Red Light District, a historic central area that is loud, crowded, and nightlife-heavy at night.",
    },
  ],
  athens: [
    {
      term: "Koulouri",
      aliases: ["koulouri"],
      definition:
        "A sesame-coated bread ring sold by bakeries and street carts, common as a quick Greek breakfast or snack.",
    },
    {
      term: "Freddo espresso",
      aliases: ["freddo espresso"],
      definition:
        "A chilled Greek espresso drink, usually shaken or blended with ice and served cold.",
    },
    {
      term: "Tiropita",
      aliases: ["tiropita"],
      definition:
        "Greek cheese pie, usually flaky pastry filled with cheese and eaten as breakfast, snack, or bakery food.",
    },
    {
      term: "Souvlaki",
      aliases: ["souvlaki"],
      definition:
        "Greek grilled skewers or pita wraps, usually a casual, fast, and affordable meal.",
    },
    {
      term: "Meze",
      aliases: ["meze"],
      definition:
        "Small shared plates served with drinks or as a grazing meal across Greece and the eastern Mediterranean.",
    },
    {
      term: "Taverna",
      aliases: ["taverna", "tavernas"],
      definition:
        "A traditional Greek restaurant, usually informal, social, and built around shared dishes or grilled staples.",
    },
    {
      term: "Rebetiko",
      aliases: ["Rebetiko"],
      definition:
        "A Greek urban folk/blues music tradition associated with intimate rooms, late nights, and emotional songs.",
    },
  ],
  berlin: [
    {
      term: "Brotchen",
      aliases: ["Brotchen", "Brötchen"],
      definition:
        "German bread rolls, a basic bakery staple for breakfast or simple sandwiches.",
    },
    {
      term: "Doner",
      aliases: ["Doner", "Döner", "Doner kebab", "Döner kebab"],
      definition:
        "A Turkish-German street-food staple of sliced rotisserie meat in bread or wrap form, central to Berlin casual eating.",
    },
    {
      term: "Currywurst",
      aliases: ["Currywurst"],
      definition:
        "A Berlin-linked fast-food classic: sliced sausage with curry ketchup, usually eaten at stands or casual counters.",
    },
    {
      term: "Spati",
      aliases: ["Spati", "Spatis", "Späti", "Spätis"],
      definition:
        "A Berlin late shop or convenience store, often used for cheap drinks before, between, or after bars.",
    },
    {
      term: "U-Bahn",
      aliases: ["U-Bahn"],
      definition:
        "Berlin's underground rail system, a key connector across the city's spread-out districts.",
    },
  ],
  copenhagen: [
    {
      term: "Smorrebrod",
      aliases: ["smorrebrod", "smørrebrød"],
      definition:
        "Danish open-faced sandwiches, usually built on dense rye bread with fish, meat, cheese, or seasonal toppings.",
    },
    {
      term: "Polser",
      aliases: ["polser", "pølser"],
      definition:
        "Danish hot dogs or sausages, often served from street carts as a quick, inexpensive meal.",
    },
    {
      term: "Kodbyen",
      aliases: ["Kodbyen", "Kødbyen"],
      definition:
        "Copenhagen's Meatpacking District, now a nightlife and restaurant zone in Vesterbro.",
    },
    {
      term: "Bodega",
      aliases: ["bodega", "bodegas"],
      definition:
        "In Denmark, an old-school, usually smoky or no-frills neighborhood bar with cheap beer and regulars.",
    },
    {
      term: "Hygge",
      aliases: ["hygge"],
      definition:
        "A Danish idea of coziness, warmth, and comfortable social atmosphere, especially important in colder months.",
    },
  ],
  "vietnam-hanoi": [
    {
      term: "Pho",
      aliases: ["pho", "pho bo", "phở", "phở bò"],
      definition:
        "Vietnamese noodle soup; pho bo is the beef version, commonly eaten for breakfast or a quick meal.",
    },
    {
      term: "Banh mi",
      aliases: ["banh mi", "bánh mì"],
      definition:
        "A Vietnamese baguette sandwich, usually filled with meat, pate, pickles, herbs, and chile.",
    },
    {
      term: "Banh cuon",
      aliases: ["banh cuon", "bánh cuốn"],
      definition:
        "Steamed rice rolls, often filled with pork or mushrooms and eaten for breakfast or a light meal.",
    },
    {
      term: "Bun cha",
      aliases: ["bun cha", "bún chả"],
      definition:
        "A Hanoi dish of grilled pork, noodles, herbs, and dipping broth, strongly associated with lunch.",
    },
    {
      term: "Com bin dan",
      aliases: ["com bin dan", "cơm bình dân"],
      definition:
        "Everyday Vietnamese rice-and-sides meals, usually displayed at casual lunch counters.",
    },
    {
      term: "Cha ca",
      aliases: ["cha ca", "chả cá"],
      definition:
        "Turmeric-marinated fish cooked with dill and herbs, one of Hanoi's signature meal formats.",
    },
    {
      term: "Lau",
      aliases: ["lau", "lẩu"],
      definition:
        "Vietnamese hotpot, a shared simmering pot for meat, seafood, vegetables, and noodles.",
    },
    {
      term: "Bia hoi",
      aliases: ["bia hoi", "bia hơi"],
      definition:
        "Fresh, low-cost draft beer served from simple street-side spots, often on plastic stools.",
    },
    {
      term: "Cyclo",
      aliases: ["cyclo", "cyclo tours"],
      definition:
        "A three-wheeled bicycle taxi, now used mostly for slow sightseeing rides in Vietnamese cities.",
    },
    {
      term: "Egg coffee",
      aliases: ["egg coffee"],
      definition:
        "A Hanoi coffee drink topped with whipped egg yolk and condensed milk, rich and dessert-like.",
    },
  ],
  "hong-kong": [
    {
      term: "Cha chaan teng",
      aliases: ["cha chaan teng"],
      definition:
        "A Hong Kong-style cafe serving fast, affordable Cantonese-Western comfort food, milk tea, noodles, rice plates, and breakfast sets.",
    },
    {
      term: "Congee",
      aliases: ["congee"],
      definition:
        "Rice porridge, often eaten for breakfast or comfort meals with meat, seafood, or preserved toppings.",
    },
    {
      term: "Pineapple bun",
      aliases: ["pineapple bun", "pineapple buns"],
      definition:
        "A Hong Kong bakery bun with a crackly sweet top; it usually does not contain pineapple.",
    },
    {
      term: "Milk tea",
      aliases: ["milk tea"],
      definition:
        "Hong Kong-style strong black tea with evaporated or condensed milk, often served hot or iced.",
    },
    {
      term: "Dim sum",
      aliases: ["dim sum"],
      definition:
        "Small Cantonese dishes, often dumplings or buns, served as a shared breakfast, brunch, or lunch meal.",
    },
    {
      term: "Wonton noodles",
      aliases: ["wonton noodles"],
      definition:
        "Cantonese noodle soup with shrimp or pork wontons, usually quick, light, and precise.",
    },
    {
      term: "Hot pot",
      aliases: ["hot pot"],
      definition:
        "A shared meal where ingredients are cooked at the table in simmering broth.",
    },
    {
      term: "MTR",
      aliases: ["MTR"],
      definition:
        "Hong Kong's metro system, one of the cleanest and most useful ways to move between districts.",
    },
    {
      term: "Wet market",
      aliases: ["wet market", "wet markets"],
      definition:
        "A fresh-food market selling produce, seafood, meat, and daily ingredients, often central to neighborhood life.",
    },
  ],
  lisbon: [
    {
      term: "Bica",
      aliases: ["bica"],
      definition:
        "Lisbon shorthand for a small espresso, usually taken quickly at a cafe counter.",
    },
    {
      term: "Pastel de nata",
      aliases: ["pastel de nata", "pasteis de belem", "pastéis de belém"],
      definition:
        "Portugal's custard tart, crisp and creamy; Pasteis de Belem is the famous Belem bakery associated with the original style.",
    },
    {
      term: "Pastelaria",
      aliases: ["pastelaria", "pastelarias"],
      definition:
        "A Portuguese pastry shop or cafe for coffee, sweets, bread, and quick counter meals.",
    },
    {
      term: "Tasca",
      aliases: ["tasca", "tascas"],
      definition:
        "A casual Portuguese tavern or neighborhood restaurant, often simple, affordable, and traditional.",
    },
    {
      term: "Prato do dia",
      aliases: ["prato do dia"],
      definition:
        "The dish of the day, usually a simple set lunch or daily special at casual Portuguese restaurants.",
    },
    {
      term: "Bacalhau",
      aliases: ["bacalhau"],
      definition:
        "Salt cod, a core Portuguese ingredient prepared in many different dishes.",
    },
    {
      term: "Bifana",
      aliases: ["bifana", "bifanas"],
      definition:
        "A Portuguese pork sandwich, usually marinated, saucy, and eaten as a quick casual meal.",
    },
    {
      term: "Petiscos",
      aliases: ["petiscos"],
      definition:
        "Portuguese small plates or snacks, similar in spirit to tapas but rooted in local tavern culture.",
    },
    {
      term: "Fado",
      aliases: ["Fado"],
      definition:
        "Portuguese song tradition, usually intimate and melancholic, often heard in dedicated dinner or listening rooms.",
    },
    {
      term: "Quiosque",
      aliases: ["quiosque", "quiosques"],
      definition:
        "An open-air kiosk in a square or park, often serving drinks, coffee, snacks, and casual public-space energy.",
    },
    {
      term: "Azulejos",
      aliases: ["azulejos"],
      definition:
        "Portuguese decorative ceramic tiles, often blue-and-white or patterned, covering churches, stations, and ordinary buildings.",
    },
    {
      term: "Calcada portuguesa",
      aliases: ["calcada portuguesa", "calçada portuguesa"],
      definition:
        "Portuguese mosaic pavement made from small black-and-white stones, common across Lisbon sidewalks and plazas.",
    },
    {
      term: "Miradouro",
      aliases: ["miradouro"],
      definition:
        "A scenic viewpoint, especially useful in Lisbon because the city is built across steep hills.",
    },
    {
      term: "Pensao",
      aliases: ["pensao", "pensoes", "pensão", "pensões"],
      definition:
        "A Portuguese guesthouse or simple lodging, often smaller and more local than a hotel.",
    },
  ],
  bangkok: [
    {
      term: "Chao Phraya",
      aliases: ["Chao Phraya"],
      definition:
        "Bangkok's major river and one of the clearest ways to structure temple, ferry, and riverside routes.",
    },
    {
      term: "Rattanakosin",
      aliases: ["Rattanakosin"],
      definition:
        "Bangkok's old royal city area, home to the Grand Palace, major temples, and historic civic weight.",
    },
  ],
};

cityLeftPaneDefinitionTerms.hanoi = cityLeftPaneDefinitionTerms["vietnam-hanoi"];

export function getLeftPaneDefinitionTerms(cityId?: string | null) {
  return cityId ? cityLeftPaneDefinitionTerms[cityId] ?? [] : [];
}
