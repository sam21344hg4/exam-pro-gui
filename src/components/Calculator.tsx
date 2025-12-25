import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator as CalcIcon, Delete } from "lucide-react";

export const Calculator = () => {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue;
      let result = 0;

      switch (operation) {
        case "+":
          result = currentValue + inputValue;
          break;
        case "-":
          result = currentValue - inputValue;
          break;
        case "×":
          result = currentValue * inputValue;
          break;
        case "÷":
          result = currentValue / inputValue;
          break;
        case "%":
          result = currentValue % inputValue;
          break;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result = 0;

    switch (operation) {
      case "+":
        result = previousValue + inputValue;
        break;
      case "-":
        result = previousValue - inputValue;
        break;
      case "×":
        result = previousValue * inputValue;
        break;
      case "÷":
        result = previousValue / inputValue;
        break;
      case "%":
        result = previousValue % inputValue;
        break;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const backspace = () => {
    if (display.length === 1 || (display.length === 2 && display[0] === "-")) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const CalcButton = ({
    children,
    onClick,
    variant = "default",
    className = "",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "operator" | "function";
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`h-12 rounded-lg font-semibold transition-all active:scale-95 ${
        variant === "operator"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : variant === "function"
          ? "bg-muted text-muted-foreground hover:bg-muted/80"
          : "bg-card text-foreground border border-border hover:bg-muted"
      } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <CalcIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Calculator</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs p-4">
        <DialogHeader>
          <DialogTitle>Calculator</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {/* Display */}
          <div className="bg-muted rounded-lg p-4 text-right">
            <div className="text-xs text-muted-foreground h-4">
              {previousValue !== null && `${previousValue} ${operation}`}
            </div>
            <div className="text-3xl font-mono font-bold text-foreground truncate">
              {display}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <CalcButton onClick={clear} variant="function">
              C
            </CalcButton>
            <CalcButton onClick={toggleSign} variant="function">
              ±
            </CalcButton>
            <CalcButton onClick={() => performOperation("%")} variant="function">
              %
            </CalcButton>
            <CalcButton onClick={() => performOperation("÷")} variant="operator">
              ÷
            </CalcButton>

            <CalcButton onClick={() => inputDigit("7")}>7</CalcButton>
            <CalcButton onClick={() => inputDigit("8")}>8</CalcButton>
            <CalcButton onClick={() => inputDigit("9")}>9</CalcButton>
            <CalcButton onClick={() => performOperation("×")} variant="operator">
              ×
            </CalcButton>

            <CalcButton onClick={() => inputDigit("4")}>4</CalcButton>
            <CalcButton onClick={() => inputDigit("5")}>5</CalcButton>
            <CalcButton onClick={() => inputDigit("6")}>6</CalcButton>
            <CalcButton onClick={() => performOperation("-")} variant="operator">
              −
            </CalcButton>

            <CalcButton onClick={() => inputDigit("1")}>1</CalcButton>
            <CalcButton onClick={() => inputDigit("2")}>2</CalcButton>
            <CalcButton onClick={() => inputDigit("3")}>3</CalcButton>
            <CalcButton onClick={() => performOperation("+")} variant="operator">
              +
            </CalcButton>

            <CalcButton onClick={() => inputDigit("0")} className="col-span-1">
              0
            </CalcButton>
            <CalcButton onClick={backspace} variant="function">
              <Delete className="h-4 w-4 mx-auto" />
            </CalcButton>
            <CalcButton onClick={inputDecimal}>.</CalcButton>
            <CalcButton onClick={calculate} variant="operator">
              =
            </CalcButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
