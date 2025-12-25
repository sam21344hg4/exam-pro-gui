import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Type, Minus, Plus } from "lucide-react";

interface TextZoomProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export const TextZoom = ({ fontSize, onFontSizeChange }: TextZoomProps) => {
  const minSize = 14;
  const maxSize = 24;

  const decrease = () => {
    if (fontSize > minSize) {
      onFontSizeChange(fontSize - 2);
    }
  };

  const increase = () => {
    if (fontSize < maxSize) {
      onFontSizeChange(fontSize + 2);
    }
  };

  const reset = () => {
    onFontSizeChange(18);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline">Zoom</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3">
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Text Size</p>
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decrease}
              disabled={fontSize <= minSize}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">
              {fontSize}px
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={increase}
              disabled={fontSize >= maxSize}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={reset}
          >
            Reset to Default
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
