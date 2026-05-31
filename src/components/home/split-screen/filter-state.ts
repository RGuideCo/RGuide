import { useState } from "react";

import {
  FOOD_CUISINE_ANY,
  FOOD_OPEN_TIME_OPTIONS,
  FoodPriceTier,
  NIGHTLIFE_BAR_TYPE_ANY,
} from "@/components/home/split-screen-config";
import type { ListCategory } from "@/types";

export function useFilterState() {
  const [visibleSubcategoryCategory, setVisibleSubcategoryCategory] = useState<ListCategory | null>(null);
  const [isSubcategoryClosing, setIsSubcategoryClosing] = useState(false);
  const [isSubcategoryCollapsing, setIsSubcategoryCollapsing] = useState(false);
  const [hoveredCategoryLabel, setHoveredCategoryLabel] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeFoodPrice, setActiveFoodPrice] = useState<FoodPriceTier | null>(null);
  const [activeFoodOpenTime, setActiveFoodOpenTime] = useState<(typeof FOOD_OPEN_TIME_OPTIONS)[number]>("Now");
  const [isFoodOpenTimeMenuOpen, setIsFoodOpenTimeMenuOpen] = useState(false);
  const [activeFoodCuisine, setActiveFoodCuisine] = useState<string>(FOOD_CUISINE_ANY);
  const [isFoodCuisineMenuOpen, setIsFoodCuisineMenuOpen] = useState(false);
  const [activeNightlifeBarType, setActiveNightlifeBarType] = useState<string>(NIGHTLIFE_BAR_TYPE_ANY);
  const [isNightlifeBarMenuOpen, setIsNightlifeBarMenuOpen] = useState(false);

  return {
    visibleSubcategoryCategory,
    setVisibleSubcategoryCategory,
    isSubcategoryClosing,
    setIsSubcategoryClosing,
    isSubcategoryCollapsing,
    setIsSubcategoryCollapsing,
    hoveredCategoryLabel,
    setHoveredCategoryLabel,
    activeSubcategory,
    setActiveSubcategory,
    activeFoodPrice,
    setActiveFoodPrice,
    activeFoodOpenTime,
    setActiveFoodOpenTime,
    isFoodOpenTimeMenuOpen,
    setIsFoodOpenTimeMenuOpen,
    activeFoodCuisine,
    setActiveFoodCuisine,
    isFoodCuisineMenuOpen,
    setIsFoodCuisineMenuOpen,
    activeNightlifeBarType,
    setActiveNightlifeBarType,
    isNightlifeBarMenuOpen,
    setIsNightlifeBarMenuOpen,
  };
}
