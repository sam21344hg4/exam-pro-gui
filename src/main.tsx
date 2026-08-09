import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./classic-overrides.css";
import "./starttest-tools.css";

createRoot(document.getElementById("root")!).render(<App />);
