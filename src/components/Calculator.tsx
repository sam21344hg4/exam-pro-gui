import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calculator as CalculatorIcon, Delete, X } from "lucide-react";

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

  const execute = (left: number, right: number, operator: string) => {
    switch (operator) {
      case "+": return left + right;
      case "-": return left - right;
      case "×": return left * right;
      case "÷": return right === 0 ? Number.NaN : left / right;
      case "%": return left % right;
      default: return right;
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = execute(previousValue, inputValue, operation);
      setDisplay(Number.isFinite(result) ? String(result) : "Error");
      setPreviousValue(Number.isFinite(result) ? result : null);
    }
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;
    const inputValue = Number.parseFloat(display);
    const result = execute(previousValue, inputValue, operation);
    setDisplay(Number.isFinite(result) ? String(result) : "Error");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    const value = Number.parseFloat(display);
    if (Number.isFinite(value)) setDisplay(String(value * -1));
  };

  const backspace = () => {
    if (waitingForOperand || display === "Error") {
      clear();
      return;
    }
    if (display.length <= 1 || (display.length === 2 && display.startsWith("-"))) setDisplay("0");
    else setDisplay(display.slice(0, -1));
  };

  const key = (label: ReactNode, onClick: () => void, kind = "number") => (
    <button type="button" onClick={onClick} className={`classic-calc-key classic-calc-${kind}`}>{label}</button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="classic-tool-trigger" title="Calculator">
          <span className="classic-bottom-icon"><CalculatorIcon size={17} strokeWidth={2.2} /></span>
          <span>Calculator</span>
        </button>
      </DialogTrigger>
      <DialogContent className="classic-calculator-dialog" aria-describedby={undefined}>
        <div className="classic-reference-titlebar">
          <span>Calculator</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close calculator"><X size={18} /></button>
        </div>
        <div className="classic-calculator-body">
          <div className="classic-calc-display" aria-live="polite">
            <small>{previousValue !== null ? `${previousValue} ${operation || ""}` : ""}</small>
            <strong>{display}</strong>
          </div>
          <div className="classic-calc-grid">
            {key("C", clear, "function")}
            {key("±", toggleSign, "function")}
            {key("%", () => performOperation("%"), "function")}
            {key("÷", () => performOperation("÷"), "operator")}
            {key("7", () => inputDigit("7"))}
            {key("8", () => inputDigit("8"))}
            {key("9", () => inputDigit("9"))}
            {key("×", () => performOperation("×"), "operator")}
            {key("4", () => inputDigit("4"))}
            {key("5", () => inputDigit("5"))}
            {key("6", () => inputDigit("6"))}
            {key("−", () => performOperation("-"), "operator")}
            {key("1", () => inputDigit("1"))}
            {key("2", () => inputDigit("2"))}
            {key("3", () => inputDigit("3"))}
            {key("+", () => performOperation("+"), "operator")}
            {key("0", () => inputDigit("0"))}
            {key(<Delete size={16} />, backspace, "function")}
            {key(".", inputDecimal)}
            {key("=", calculate, "operator")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
