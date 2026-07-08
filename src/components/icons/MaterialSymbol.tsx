import type { CSSProperties, HTMLAttributes, ReactElement } from "react";

export type MaterialSymbolProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  filled?: boolean;
  grade?: -25 | 0 | 200;
  name: string;
  opticalSize?: 20 | 24 | 40 | 48;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
};

export type MaterialSymbolIconProps = Omit<MaterialSymbolProps, "name">;
export type MaterialSymbolIcon = (props: MaterialSymbolIconProps) => ReactElement;

const SIZE_FROM_CLASS: Array<[RegExp, string]> = [
  [/\bh-2\.5\b|\bw-2\.5\b/, "0.75rem"],
  [/\bh-3\b|\bw-3\b/, "0.875rem"],
  [/\bh-3\.5\b|\bw-3\.5\b/, "1rem"],
  [/\bh-4\b|\bw-4\b/, "1.125rem"],
  [/\bh-5\b|\bw-5\b/, "1.375rem"],
  [/\bh-6\b|\bw-6\b/, "1.625rem"],
  [/\bh-7\b|\bw-7\b/, "1.875rem"],
  [/\bh-8\b|\bw-8\b/, "2.25rem"],
  [/\bh-10\b|\bw-10\b/, "2.75rem"],
];

function inferFontSize(className?: string) {
  if (!className) {
    return undefined;
  }
  return SIZE_FROM_CLASS.find(([pattern]) => pattern.test(className))?.[1];
}

function shouldFillFromClassName(className?: string) {
  if (!className) {
    return false;
  }
  return className.split(/\s+/).some((token) => token === "fill-current" || /^fill-(?!transparent|none)/.test(token));
}

export function MaterialSymbol({
  className,
  filled = true,
  grade = 0,
  name,
  opticalSize = 24,
  style,
  weight = 300,
  ...props
}: MaterialSymbolProps) {
  const inferredSize = inferFontSize(className);
  const shouldFill = filled || shouldFillFromClassName(className);
  const symbolStyle: CSSProperties & Record<"--rguide-symbol-fill" | "--rguide-symbol-grade" | "--rguide-symbol-opsz" | "--rguide-symbol-weight", number> = {
    "--rguide-symbol-fill": shouldFill ? 1 : 0,
    "--rguide-symbol-grade": grade,
    "--rguide-symbol-opsz": opticalSize,
    "--rguide-symbol-weight": weight,
    fontSize: inferredSize,
    fontVariationSettings:
      "'FILL' var(--rguide-symbol-fill), 'wght' var(--rguide-symbol-weight), 'GRAD' var(--rguide-symbol-grade), 'opsz' var(--rguide-symbol-opsz)",
    ...style,
  };

  return (
    <span
      aria-hidden="true"
      className={`material-symbols-rounded rguide-material-symbol inline-flex shrink-0 items-center justify-center ${className ?? ""}`}
      style={symbolStyle}
      {...props}
    >
      {name}
    </span>
  );
}

export function createMaterialSymbol(
  name: string,
  defaults: Omit<MaterialSymbolIconProps, "className" | "style"> = {},
): MaterialSymbolIcon {
  const Icon = ({ filled, grade, opticalSize, weight, ...props }: MaterialSymbolIconProps) => (
    <MaterialSymbol
      name={name}
      filled={filled ?? defaults.filled}
      grade={grade ?? defaults.grade}
      opticalSize={opticalSize ?? defaults.opticalSize}
      weight={weight ?? defaults.weight}
      {...props}
    />
  );
  Icon.displayName = `MaterialSymbol(${name})`;
  return Icon;
}

export const Add = createMaterialSymbol("add");
export const ArrowRight = createMaterialSymbol("arrow_forward");
export const BadgeInfo = createMaterialSymbol("info");
export const BedDouble = createMaterialSymbol("bed");
export const BookOpen = createMaterialSymbol("menu_book");
export const Bookmark = createMaterialSymbol("bookmark");
export const Building2 = createMaterialSymbol("location_city");
export const CalendarCheck = createMaterialSymbol("event_available");
export const CalendarDays = createMaterialSymbol("calendar_month");
export const Camera = createMaterialSymbol("photo_camera");
export const Check = createMaterialSymbol("check");
export const ChevronDown = createMaterialSymbol("keyboard_arrow_down");
export const ChevronRight = createMaterialSymbol("chevron_right");
export const Clock3 = createMaterialSymbol("schedule");
export const CloudSun = createMaterialSymbol("partly_cloudy_day");
export const ExternalLink = createMaterialSymbol("open_in_new");
export const Eye = createMaterialSymbol("visibility");
export const EyeOff = createMaterialSymbol("visibility_off");
export const Flag = createMaterialSymbol("flag");
export const Flame = createMaterialSymbol("local_fire_department");
export const Footprints = createMaterialSymbol("footprint");
export const Globe2 = createMaterialSymbol("public");
export const GripVertical = createMaterialSymbol("drag_indicator");
export const Heart = createMaterialSymbol("favorite");
export const Landmark = createMaterialSymbol("account_balance");
export const LocateFixed = createMaterialSymbol("my_location");
export const Lock = createMaterialSymbol("lock");
export const LogOut = createMaterialSymbol("logout");
export const Map = createMaterialSymbol("map");
export const MapIcon = Map;
export const MapPin = createMaterialSymbol("location_on");
export const MapPinned = createMaterialSymbol("location_on");
export const Menu = createMaterialSymbol("menu");
export const Minus = createMaterialSymbol("remove");
export const MoonStar = createMaterialSymbol("nightlife");
export const Navigation = createMaterialSymbol("near_me");
export const Pencil = createMaterialSymbol("edit");
export const Plus = Add;
export const Road = createMaterialSymbol("signpost");
export const Route = createMaterialSymbol("route");
export const Search = createMaterialSymbol("search");
export const Settings = createMaterialSymbol("settings");
export const Sparkles = createMaterialSymbol("auto_awesome");
export const SquareArrowOutUpRight = createMaterialSymbol("open_in_new");
export const Star = createMaterialSymbol("star", { filled: true });
export const Trash2 = createMaterialSymbol("delete");
export const Trees = createMaterialSymbol("park");
export const Upload = createMaterialSymbol("upload");
export const User = createMaterialSymbol("person");
export const UserRound = createMaterialSymbol("person");
export const Users = createMaterialSymbol("group");
export const UtensilsCrossed = createMaterialSymbol("restaurant");
export const X = createMaterialSymbol("close");

export const MaterialAccountBalance = Landmark;
export const MaterialAutoAwesome = Sparkles;
export const MaterialBed = BedDouble;
export const MaterialCalendarMonth = CalendarDays;
export const MaterialEditSquare = createMaterialSymbol("edit_square");
export const MaterialFavorite = Heart;
export const MaterialHotel = createMaterialSymbol("hotel");
export const MaterialInfo = BadgeInfo;
export const MaterialLocalFireDepartment = Flame;
export const MaterialLocationOn = MapPin;
export const MaterialMap = Map;
export const MaterialMenuBook = BookOpen;
export const MaterialNightlife = MoonStar;
export const MaterialPark = Trees;
export const MaterialPerson = User;
export const MaterialRestaurant = UtensilsCrossed;
export const MaterialRoute = Route;
export const MaterialSettings = Settings;
export const MaterialSignpost = Road;
export const MaterialGroups = Users;
