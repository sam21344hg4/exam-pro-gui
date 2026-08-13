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
  const handleContextMenu = (event: MouseEvent<HTMLElement>) => {
    if (showResult || !onToggleStrikethrough) return;
    event.preventDefault();
    onToggleStrikethrough();
  };

  return (
    <div className="classic-option-row" onContextMenu={handleContextMenu}>
      <label
        className={cn(
          "classic-option",
          isSelected && "is-selected",
          showResult && isCorrect && "is-correct",
          showResult && isSelected && !isCorrect && "is-incorrect",
          isStrikethrough && !showResult && "is-struck"
        )}
      >
        <input
          className="classic-radio-input"
          type="radio"
          name="classic-exam-answer"
          checked={isSelected}
          onChange={onClick}
          disabled={disabled}
          aria-label={`Option ${label}`}
        />
        <span
          className={cn("classic-option-text", isStrikethrough && !showResult && "is-struck")}
          style={{ fontSize: `${Math.max(fontSize - 2, 14)}px` }}
        >
          <strong>{label}.</strong> {text}
        </span>
      </label>

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
