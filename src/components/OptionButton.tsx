import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface OptionButtonProps {
  label: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  onClick: () => void;
  disabled?: boolean;
  fontSize?: number;
  isStrikethrough?: boolean;
  onToggleStrikethrough?: () => void;
}

export const OptionButton = ({
  label,
  text,
  isSelected,
  isCorrect,
  showResult,
  onClick,
  disabled,
  fontSize = 18,
  isStrikethrough = false,
  onToggleStrikethrough,
}: OptionButtonProps) => {
  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    if (showResult || !onToggleStrikethrough) return;
    event.preventDefault();
    onToggleStrikethrough();
  };

  return (
    <div className="classic-option-row">
      <button
        type="button"
        onClick={onClick}
        onContextMenu={handleContextMenu}
        disabled={disabled}
        className={cn(
          "classic-option",
          isSelected && "is-selected",
          showResult && isCorrect && "is-correct",
          showResult && isSelected && !isCorrect && "is-incorrect",
          isStrikethrough && !showResult && "is-struck"
        )}
        aria-pressed={isSelected}
      >
        <span className="classic-radio" aria-hidden="true">
          {isSelected ? <span className="classic-radio-dot" /> : null}
        </span>
        <span
          className={cn("classic-option-text", isStrikethrough && !showResult && "is-struck")}
          style={{ fontSize: `${Math.max(fontSize - 2, 14)}px` }}
        >
          <strong>{label})</strong> {text}
        </span>
      </button>

      {!showResult && onToggleStrikethrough ? (
        <button
          type="button"
          className="classic-strike-button"
          aria-label={isStrikethrough ? `Remove strikeout from option ${label}` : `Strike out option ${label}`}
          aria-pressed={isStrikethrough}
          title={isStrikethrough ? `Remove strikeout from option ${label}` : `Strike out option ${label}`}
          onClick={onToggleStrikethrough}
          onContextMenu={(event) => {
            event.preventDefault();
            onToggleStrikethrough();
          }}
        >
          <span className="classic-strike-glyph" aria-hidden="true">ab</span>
        </button>
      ) : null}
    </div>
  );
};
