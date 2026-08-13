import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./classic-overrides.css";
import "./source-lab-values.css";
import "./source-help.css";
import "./starttest-source.css";

createRoot(document.getElementById("root")!).render(<App />);
