import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

export type MobileBrowseSelectOption = {
  value: string;
  label: string;
};

export function MobileBrowseSelect({
  label,
  value,
  placeholder,
  options,
  selectedIcon,
  forceIconButton = false,
  centeredMenu = false,
  showPlaceholderOption = true,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: MobileBrowseSelectOption[];
  selectedIcon?: ReactNode;
  forceIconButton?: boolean;
  centeredMenu?: boolean;
  showPlaceholderOption?: boolean;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPointerLeft, setMenuPointerLeft] = useState<number | null>(null);
  const [menuTop, setMenuTop] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);
  const isIconButton = forceIconButton || Boolean(selectedOption && selectedIcon);
  const shouldCenterMenu = isIconButton && centeredMenu;
  const handleOptionSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };
  const openMenu = () => {
    if (shouldCenterMenu) {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      const menuWidth = Math.min(288, Math.max(0, window.innerWidth - 24));
      const menuLeft = (window.innerWidth - menuWidth) / 2;
      if (triggerRect) {
        const pointerLeft = triggerRect.left + triggerRect.width / 2 - menuLeft;
        setMenuPointerLeft(Math.min(menuWidth - 18, Math.max(18, pointerLeft)));
        setMenuTop(triggerRect.bottom + 10);
      }
    }
    setIsOpen((current) => !current);
  };

  return (
    <div
      className={isIconButton ? "relative shrink-0" : "relative mx-auto w-full max-w-[18rem] basis-full"}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        className={
          isIconButton
            ? "flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:border-slate-300 focus-visible:ring-orange-500/50"
            : "flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 text-left text-sm font-semibold text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition hover:border-slate-300 focus-visible:ring-orange-500/50"
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        title={selectedOption?.label ?? placeholder}
      >
        {isIconButton ? (
          selectedIcon ?? (
            <video
              muted
              loop
              autoPlay
              playsInline
              preload="auto"
              poster="/assets/rotating-earth-still.png"
              className="h-8 w-8 rounded-full object-cover"
            >
              <source src="/assets/rotating-earth.webm" type="video/webm" />
              <source src="/assets/rotating-earth.mp4" type="video/mp4" />
            </video>
          )
        ) : (
          <>
            <span className={selectedOption ? "truncate" : "truncate text-slate-500"}>
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute top-[calc(100%+0.65rem)] z-[90] max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl ${
            shouldCenterMenu
              ? ""
              : isIconButton
                ? "left-1/2 w-56 -translate-x-1/2"
                : "left-0 right-0"
          }`}
          style={
            shouldCenterMenu
              ? {
                  position: "fixed",
                  left: "50%",
                  right: "auto",
                  top: menuTop !== null ? `${menuTop}px` : "4.25rem",
                  width: "min(18rem, calc(100vw - 1.5rem))",
                  transform: "translateX(-50%)",
                }
              : undefined
          }
        >
          <span
            className={`pointer-events-none absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white ${
              shouldCenterMenu
                ? ""
                : isIconButton
                  ? "left-1/2 -translate-x-1/2"
                  : "left-5"
            }`}
            style={shouldCenterMenu && menuPointerLeft !== null ? { left: `${menuPointerLeft - 6}px` } : undefined}
            aria-hidden="true"
          />
          {showPlaceholderOption ? (
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleOptionSelect("");
              }}
              className={`mb-1 flex w-full items-center rounded-lg px-3 py-3 text-left text-base font-semibold transition ${
                !value ? "bg-orange-50 text-orange-700" : "bg-stone-50 text-slate-800 hover:bg-stone-100 hover:text-slate-950"
              }`}
            >
              <span>{placeholder}</span>
            </button>
          ) : null}
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                handleOptionSelect(option.value);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                value === option.value
                  ? "bg-orange-50 text-orange-700"
                  : "text-slate-700 hover:bg-stone-100 hover:text-slate-950"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
