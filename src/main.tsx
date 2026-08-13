import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./classic-overrides.css";
import "./starttest-tools.css";
import "./starttest-layout.css";
import "./starttest-zoom-fix.css";
import "./starttest-answer-fix.css";
import "./source-lab-values.css";
import "./nbme-driver-source.css";
import "./source-help.css";

createRoot(document.getElementById("root")!).render(<App />);
