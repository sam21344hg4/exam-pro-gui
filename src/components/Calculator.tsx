import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calculator as CalculatorIcon } from "lucide-react";
import { useExamUI } from "./ExamUIProvider";

export const Calculator = () => {
  const { activePopup, calculatorOpen, toggleCalculator } = useExamUI();
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memoryValue, setMemoryValue] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (wasOpenRef.current && !calculatorOpen) triggerRef.current?.focus();
    wasOpenRef.current = calculatorOpen;
  }, [calculatorOpen]);

  const numericDisplay = () => {
    const value = Number.parseFloat(display);
    return Number.isFinite(value) ? value : 0;
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand || display === "Error") {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }
    setDisplay(display === "0" ? digit : display + digit);
  };

  const inputDecimal = () => {
    if (waitingForOperand || display === "Error") {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) setDisplay(`${display}.`);
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
      default: return right;
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = numericDisplay();
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = execute(previousValue, inputValue, operation);
      if (!Number.isFinite(result)) {
        setDisplay("Error");
        setPreviousValue(null);
      } else {
        setDisplay(String(result));
        setPreviousValue(result);
      }
    }
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const equals = () => {
    if (previousValue === null || !operation) return;
    const result = execute(previousValue, numericDisplay(), operation);
    setDisplay(Number.isFinite(result) ? String(result) : "Error");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const negate = () => setDisplay(String(numericDisplay() * -1));
  const squareRoot = () => {
    const value = numericDisplay();
    setDisplay(value < 0 ? "Error" : String(Math.sqrt(value)));
    setWaitingForOperand(true);
  };
  const invert = () => {
    const value = numericDisplay();
    setDisplay(value === 0 ? "Error" : String(1 / value));
    setWaitingForOperand(true);
  };

  const memoryPlus = () => setMemoryValue((value) => value + numericDisplay());
  const memoryRecall = () => {
    setDisplay(String(memoryValue));
    setWaitingForOperand(true);
  };
  const memoryClear = () => setMemoryValue(0);

  const panel = calculatorOpen
    ? createPortal(
        <div className={`nbme-calculator-panel${activePopup === "notes" ? " with-notes" : ""}`} role="dialog" aria-label="Calculator" aria-modal="false">
          <div className={`nbme-calc-display${memoryValue !== 0 ? " has-memory" : ""}`}>
            <span className="nbme-calc-equation">{previousValue !== null ? `${previousValue} ${operation || ""}` : "\u00a0"}</span>
            <span className="nbme-calc-operand">{display}</span>
          </div>
          <table className="nbme-calc-table" aria-label="Calculator keypad">
            <tbody>
              <tr>
                <td><button className="nbme-calc-purple" onClick={memoryPlus}>M+</button></td>
                <td><button className="nbme-calc-purple" onClick={memoryRecall}>MR</button></td>
                <td><button className="nbme-calc-purple" onClick={memoryClear}>MC</button></td>
                <td><button className="nbme-calc-yellow" onClick={clear}>C</button></td>
              </tr>
              <tr>
                <td><button className="nbme-calc-blue" onClick={negate}>±</button></td>
                <td><button className="nbme-calc-blue" onClick={squareRoot}>√<span className="nbme-root-x">x</span></button></td>
                <td><button className="nbme-calc-blue" onClick={invert}>1/x</button></td>
                <td><button className="nbme-calc-blue" onClick={() => performOperation("÷")}>÷</button></td>
              </tr>
              <tr>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("7")}>7</button></td>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("8")}>8</button></td>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("9")}>9</button></td>
                <td><button className="nbme-calc-blue" onClick={() => performOperation("×")}>×</button></td>
              </tr>
              <tr>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("4")}>4</button></td>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("5")}>5</button></td>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("6")}>6</button></td>
                <td><button className="nbme-calc-blue" onClick={() => performOperation("-")}>−</button></td>
              </tr>
              <tr>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("1")}>1</button></td>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("2")}>2</button></td>
                <td><button className="nbme-calc-gray" onClick={() => inputDigit("3")}>3</button></td>
                <td><button className="nbme-calc-blue" onClick={() => performOperation("+")}>+</button></td>
              </tr>
              <tr>
                <td colSpan={2}><button className="nbme-calc-gray nbme-calc-wide" onClick={() => inputDigit("0")}>0</button></td>
                <td><button className="nbme-calc-gray" onClick={inputDecimal}>.</button></td>
                <td><button className="nbme-calc-yellow" onClick={equals}>=</button></td>
              </tr>
            </tbody>
          </table>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button ref={triggerRef} type="button" className="classic-tool-trigger" title="Calculator" aria-expanded={calculatorOpen} onClick={toggleCalculator}>
        <span className="classic-tool-square-icon"><CalculatorIcon size={24} strokeWidth={2.3} /></span>
        <span>Calculator</span>
      </button>
      {panel}
    </>
  );
};
