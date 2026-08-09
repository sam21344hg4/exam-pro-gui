import { X } from "lucide-react";
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
}: OptionButtonProps) => (
  <div className="classic-option-row">
    <button
      type="button"
      onClick={onClick}
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
        aria-label={isStrikethrough ? `Restore option ${label}` : `Strikeout option ${label}`}
        aria-pressed={isStrikethrough}
        title={isStrikethrough ? `Restore option ${label}` : `Strikeout option ${label}`}
        onClick={onToggleStrikethrough}
      >
        <X size={15} strokeWidth={2.2} />
      </button>
    ) : null}
  </div>
);
