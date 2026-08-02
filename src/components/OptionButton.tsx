import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
  const buttonContent = (
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
    >
      <span className="classic-radio" aria-hidden="true">
        {isSelected && <span className="classic-radio-dot" />}
      </span>
      <span
        className={cn("classic-option-text", isStrikethrough && !showResult && "line-through")}
        style={{ fontSize: `${Math.max(fontSize - 2, 14)}px` }}
      >
        <strong>{label})</strong> {text}
      </span>
    </button>
  );

  if (!onToggleStrikethrough || showResult) {
    return buttonContent;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{buttonContent}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onToggleStrikethrough}>
          {isStrikethrough ? "Remove strikethrough" : "Strikethrough"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
