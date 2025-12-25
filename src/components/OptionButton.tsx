import { Check, X } from "lucide-react";
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
  const getBackgroundClass = () => {
    if (!showResult) {
      if (isStrikethrough) {
        return "bg-muted/50 border-border opacity-60";
      }
      return isSelected ? "bg-option-selected border-primary" : "bg-option-bg border-border hover:bg-option-hover";
    }
    
    if (isCorrect) {
      return "bg-option-correct border-success";
    }
    
    if (isSelected && !isCorrect) {
      return "bg-option-incorrect border-destructive";
    }
    
    return "bg-option-bg border-border opacity-60";
  };

  const getLabelClass = () => {
    if (!showResult) {
      if (isStrikethrough) {
        return "bg-muted/70 text-muted-foreground line-through";
      }
      return isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground";
    }
    
    if (isCorrect) {
      return "bg-success text-success-foreground";
    }
    
    if (isSelected && !isCorrect) {
      return "bg-destructive text-destructive-foreground";
    }
    
    return "bg-muted text-muted-foreground";
  };

  const buttonContent = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:cursor-default",
        !disabled && "hover:shadow-md cursor-pointer",
        getBackgroundClass()
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors",
          getLabelClass()
        )}
      >
        {showResult && isCorrect ? (
          <Check className="h-5 w-5" />
        ) : showResult && isSelected && !isCorrect ? (
          <X className="h-5 w-5" />
        ) : (
          label
        )}
      </span>
      <span 
        className={cn(
          "font-clinical text-left text-foreground",
          isStrikethrough && !showResult && "line-through text-muted-foreground"
        )}
        style={{ fontSize: `${fontSize}px` }}
      >
        {text}
      </span>
    </button>
  );

  // If no strikethrough handler or in result mode, just render the button
  if (!onToggleStrikethrough || showResult) {
    return buttonContent;
  }

  // Wrap with context menu for strikethrough feature
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {buttonContent}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onToggleStrikethrough} className="gap-2">
          {isStrikethrough ? (
            <>
              <span className="text-sm">Remove strikethrough</span>
            </>
          ) : (
            <>
              <span className="text-sm line-through">Strikethrough</span>
            </>
          )}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
