import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { PanelsTopLeft, X } from "lucide-react";

type LabTab = "serum" | "cerebrospinal" | "blood" | "urine";
type LabCell = {
  tag: "th" | "td";
  className: string;
  html: string;
};
type LabRow = LabCell[];

const tabs: Array<{ id: LabTab; label: string }> = [
  { id: "serum", label: "Serum" },
  { id: "cerebrospinal", label: "Cerebrospinal" },
  { id: "blood", label: "Blood" },
  { id: "urine", label: "Urine and BMI" },
];

const sourceLabTables: Record<LabTab, LabRow[]> = {
  serum: [
    [{ tag: "th", className: "table-cell-header", html: "Serum" }, { tag: "th", className: "table-cell-header2", html: "Reference Range" }, { tag: "th", className: "table-cell-header3", html: "SI Reference" }],
    [{ tag: "td", className: "table-cell-1", html: "Alanine aminotransferase (ALT)" }, { tag: "td", className: "table-cell-2", html: "10–40 U/L" }, { tag: "td", className: "table-cell-3", html: "10–40 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Aspartate aminotransferase (AST)" }, { tag: "td", className: "table-cell-2", html: "12–38 U/L" }, { tag: "td", className: "table-cell-3", html: "12–38 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Alkaline phosphatase" }, { tag: "td", className: "table-cell-2", html: "25–100 U/L" }, { tag: "td", className: "table-cell-3", html: "25–100 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Amylase" }, { tag: "td", className: "table-cell-2", html: "25–125 U/L" }, { tag: "td", className: "table-cell-3", html: "25–125 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Bilirubin, Total // Direct" }, { tag: "td", className: "table-cell-2", html: "0.1–1.0 mg/dL // 0.0–0.3 mg/dL" }, { tag: "td", className: "table-cell-3", html: "2–17 µmol/L // 0–5 µmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Calcium" }, { tag: "td", className: "table-cell-2", html: "8.4–10.2 mg/dL" }, { tag: "td", className: "table-cell-3", html: "2.1–2.6 mmol/L" }],
    [{ tag: "th", className: "table-cell-header", html: "Cholesterol" }, { tag: "td", className: "table-cell-2", html: "" }, { tag: "td", className: "table-cell-3", html: "" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Total" }, { tag: "td", className: "table-cell-2", html: "Normal: &lt;200 mg/dL // High:&gt;240 mg/dL" }, { tag: "td", className: "table-cell-3", html: "&lt;5.2 mmol/L // &gt;6.2 mmol/L" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "HDL" }, { tag: "td", className: "table-cell-2", html: "40–60 mg/dL" }, { tag: "td", className: "table-cell-3", html: "1.0–1.6 mmol/L" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "LDL" }, { tag: "td", className: "table-cell-2", html: "&lt;160 mg/dL" }, { tag: "td", className: "table-cell-3", html: "&lt;4.2 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Triglycerides" }, { tag: "td", className: "table-cell-2", html: "Normal: &lt;150 mg/dL // Borderline: 151–199 mg/dL" }, { tag: "td", className: "table-cell-3", html: "&lt;1.70 mmol/L // 1.71–2.25 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Cortisol" }, { tag: "td", className: "table-cell-2", html: "0800 h: 5–23 µg/dL // 1600 h: 3–15 µg/dL" }, { tag: "td", className: "table-cell-3", html: "138–635 nmol/L // 82–413 nmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "2000 h: &lt;50% of 0800 h" }, { tag: "td", className: "table-cell-3", html: "Fraction of 0800 h: &lt;0.50" }],
    [{ tag: "td", className: "table-cell-1", html: "Creatine kinase" }, { tag: "td", className: "table-cell-2", html: "Male: 25–90 U/L" }, { tag: "td", className: "table-cell-3", html: "25–90 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 10–70 U/L" }, { tag: "td", className: "table-cell-3", html: "10–70 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Creatinine" }, { tag: "td", className: "table-cell-2", html: "0.6–1.2 mg/dL" }, { tag: "td", className: "table-cell-3", html: "53–106 µmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Urea nitrogen" }, { tag: "td", className: "table-cell-2", html: "7–18 mg/dL" }, { tag: "td", className: "table-cell-3", html: "2.5–6.4 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Creatinine clearance" }, { tag: "td", className: "table-cell-2", html: "Male: 97–137 mL/min" }, { tag: "td", className: "table-cell-3", html: "97–137 mL/min" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 88–128 mL/min" }, { tag: "td", className: "table-cell-3", html: "88–128 mL/min" }],
    [{ tag: "th", className: "table-cell-header", html: "Electrolytes, serum" }, { tag: "td", className: "table-cell-2", html: "" }, { tag: "td", className: "table-cell-3", html: "" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Sodium (Na<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">+</span>)" }, { tag: "td", className: "table-cell-2", html: "136–146 mEq/L" }, { tag: "td", className: "table-cell-3", html: "136–146 mmol/L" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Potassium (K<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">+</span>)" }, { tag: "td", className: "table-cell-2", html: "3.5–5.0 mEq/L" }, { tag: "td", className: "table-cell-3", html: "3.5–5.0 mmol/L" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Chloride (Cl<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">–</span>)" }, { tag: "td", className: "table-cell-2", html: "95–105 mEq/L" }, { tag: "td", className: "table-cell-3", html: "95–105 mmol/L" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Bicarbonate (HCO<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">3</span><span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">–</span>)" }, { tag: "td", className: "table-cell-2", html: "22–28 mEq/L" }, { tag: "td", className: "table-cell-3", html: "22–28 mmol/L" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Magnesium (Mg<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">2</span><span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">+</span>)" }, { tag: "td", className: "table-cell-2", html: "1.5–2.0 mg/dL" }, { tag: "td", className: "table-cell-3", html: "0.75–1.0 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Ferritin" }, { tag: "td", className: "table-cell-2", html: "Male: 20–250 ng/mL" }, { tag: "td", className: "table-cell-3", html: "20–250 µg/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 10–120 ng/mL" }, { tag: "td", className: "table-cell-3", html: "10–120 µg/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Follicle-stimulating hormone" }, { tag: "td", className: "table-cell-2", html: "Male: 4–25 mIU/mL" }, { tag: "td", className: "table-cell-3", html: "4–25 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: premenopause 4–30 mIU/mL" }, { tag: "td", className: "table-cell-3", html: "4–30 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2-indent1", html: "midcycle peak 10–90 mIU/mL" }, { tag: "td", className: "table-cell-3", html: "10–90 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2-indent1", html: "postmenopause 40–250 mIU/mL" }, { tag: "td", className: "table-cell-3", html: "40–250 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Glucose" }, { tag: "td", className: "table-cell-2", html: "Fasting: 70–100 mg/dL" }, { tag: "td", className: "table-cell-3", html: "3.8–5.6 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Random, non-fasting: &lt;140 mg/dL" }, { tag: "td", className: "table-cell-3", html: "&lt;7.77 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Growth hormone - arginine stimulation" }, { tag: "td", className: "table-cell-2", html: "Fasting: &lt;5 ng/mL" }, { tag: "td", className: "table-cell-3", html: "&lt;5 µg/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Provocative stimuli: &gt;7 ng/mL" }, { tag: "td", className: "table-cell-3", html: "&gt;7 µg/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Iron" }, { tag: "td", className: "table-cell-2", html: "Male: 65–175 µg/dL" }, { tag: "td", className: "table-cell-3", html: "11.6–31.3 µmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 50–170 µg/dL" }, { tag: "td", className: "table-cell-3", html: "9.0–30.4 µmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Total iron-binding capacity" }, { tag: "td", className: "table-cell-2", html: "250–400 µg/dL" }, { tag: "td", className: "table-cell-3", html: "44.8–71.6 µmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Transferrin" }, { tag: "td", className: "table-cell-2", html: "200–360 mg/dL" }, { tag: "td", className: "table-cell-3", html: "2.0–3.6 g/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Lactate dehydrogenase" }, { tag: "td", className: "table-cell-2", html: "45–200 U/L" }, { tag: "td", className: "table-cell-3", html: "45–200 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Lipase" }, { tag: "td", className: "table-cell-2", html: "13–60 U/L" }, { tag: "td", className: "table-cell-3", html: "13–60 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Luteinizing hormone" }, { tag: "td", className: "table-cell-2", html: "Male: 6–23 mIU/mL" }, { tag: "td", className: "table-cell-3", html: "6–23 U/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: follicular phase 5–30 mIU/mL" }, { tag: "td", className: "table-cell-3", html: "5–30 IU/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "midcycle 75–150 mIU/mL" }, { tag: "td", className: "table-cell-3", html: "75–150 IU/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "postmenopause 30–200 mIU/mL" }, { tag: "td", className: "table-cell-3", html: "30–200 IU/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Osmolality" }, { tag: "td", className: "table-cell-2", html: "275–295 mOsmol/kg H<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">2</span>O" }, { tag: "td", className: "table-cell-3", html: "275–295 mOsmol/kg H<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">2</span>O" }],
    [{ tag: "td", className: "table-cell-1", html: "Intact parathyroid hormone (PTH)" }, { tag: "td", className: "table-cell-2", html: "10–60 pg/mL" }, { tag: "td", className: "table-cell-3", html: "10–60 ng/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Phosphorus (inorganic)" }, { tag: "td", className: "table-cell-2", html: "3.0–4.5 mg/dL" }, { tag: "td", className: "table-cell-3", html: "1.0–1.5 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Prolactin (hPRL)" }, { tag: "td", className: "table-cell-2", html: "Male: &lt;17 ng/mL" }, { tag: "td", className: "table-cell-3", html: "&lt;17 µg/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: &lt;25 ng/mL" }, { tag: "td", className: "table-cell-3", html: "&lt;25 µg/L" }],
    [{ tag: "th", className: "table-cell-header", html: "Proteins" }, { tag: "td", className: "table-cell-2", html: "" }, { tag: "td", className: "table-cell-3", html: "" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Total" }, { tag: "td", className: "table-cell-2", html: "6.0–7.8 g/dL" }, { tag: "td", className: "table-cell-3", html: "60–78 g/L" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Albumin" }, { tag: "td", className: "table-cell-2", html: "3.5–5.5 g/dL" }, { tag: "td", className: "table-cell-3", html: "35–55 g/L" }],
    [{ tag: "td", className: "table-cell-1-indent1", html: "Globulin" }, { tag: "td", className: "table-cell-2", html: "2.3–3.5 g/dL" }, { tag: "td", className: "table-cell-3", html: "23–35 g/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Troponin I" }, { tag: "td", className: "table-cell-2", html: "≤0.04 ng/mL" }, { tag: "td", className: "table-cell-3", html: "≤0.04 µg/L" }],
    [{ tag: "td", className: "table-cell-1", html: "TSH" }, { tag: "td", className: "table-cell-2", html: "0.4–4.0 µU/mL" }, { tag: "td", className: "table-cell-3", html: "0.4–4.0 mIU/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Thyroidal iodine (<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">123</span>I) uptake" }, { tag: "td", className: "table-cell-2", html: "8%–30% of administered dose/24 h" }, { tag: "td", className: "table-cell-3", html: "0.08–0.30/24 h" }],
    [{ tag: "td", className: "table-cell-1", html: "Thyroxine (T<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">4</span>)" }, { tag: "td", className: "table-cell-2", html: "5–12 µg/dL" }, { tag: "td", className: "table-cell-3", html: "64–155 nmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Free T<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">4</span>" }, { tag: "td", className: "table-cell-2", html: "0.9–1.7 ng/dL" }, { tag: "td", className: "table-cell-3", html: "12.0–21.9 pmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Triiodothyronine (T<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">3</span>) (RIA)" }, { tag: "td", className: "table-cell-2", html: "100–200 ng/dL" }, { tag: "td", className: "table-cell-3", html: "1.5–3.1 nmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Triiodothyronine (T<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">3</span>) resin uptake" }, { tag: "td", className: "table-cell-2", html: "25%–35%" }, { tag: "td", className: "table-cell-3", html: "0.25–0.35" }],
    [{ tag: "td", className: "table-cell-1", html: "Uric acid" }, { tag: "td", className: "table-cell-2", html: "3.0–8.2 mg/dL" }, { tag: "td", className: "table-cell-3", html: "0.18–0.48 mmol/L" }],
    [{ tag: "td", className: "table-cell-header", html: "Immunoglobulins" }, { tag: "td", className: "table-cell-2", html: "" }, { tag: "td", className: "table-cell-3", html: "" }],
    [{ tag: "td", className: "table-cell-1", html: "IgA" }, { tag: "td", className: "table-cell-2", html: "76–390 mg/dL" }, { tag: "td", className: "table-cell-3", html: "0.76–3.90 g/L" }],
    [{ tag: "td", className: "table-cell-1", html: "IgE" }, { tag: "td", className: "table-cell-2", html: "0–380 IU/mL" }, { tag: "td", className: "table-cell-3", html: "0–380 kIU/L" }],
    [{ tag: "td", className: "table-cell-1", html: "IgG" }, { tag: "td", className: "table-cell-2", html: "650–1500 mg/dL" }, { tag: "td", className: "table-cell-3", html: "6.5–15.0 g/L" }],
    [{ tag: "td", className: "table-cell-1", html: "IgM" }, { tag: "td", className: "table-cell-2", html: "50–300 mg/dL" }, { tag: "td", className: "table-cell-3", html: "0.5–3.0 g/L" }],
    [{ tag: "th", className: "table-cell-header", html: "Gases, arterial blood (room air)" }, { tag: "td", className: "table-cell-2", html: "" }, { tag: "td", className: "table-cell-3", html: "" }],
    [{ tag: "td", className: "table-cell-1", html: "pH" }, { tag: "td", className: "table-cell-2", html: "7.35–7.45" }, { tag: "td", className: "table-cell-3", html: "[H+] 36–44 nmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Pco<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">2</span>" }, { tag: "td", className: "table-cell-2", html: "33–45 mm Hg" }, { tag: "td", className: "table-cell-3", html: "4.4–5.9 kPa" }],
    [{ tag: "td", className: "table-cell-1", html: "Po<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">2</span>" }, { tag: "td", className: "table-cell-2", html: "75–105 mm Hg" }, { tag: "td", className: "table-cell-3", html: "10.0–14.0 kPa" }],
  ],
  cerebrospinal: [
    [{ tag: "td", className: "table-cell-header", html: "Cerebrospinal Fluid" }, { tag: "td", className: "table-cell-header2", html: "Reference Range" }, { tag: "td", className: "table-cell-header3", html: "SI Reference" }],
    [{ tag: "td", className: "table-cell-1", html: "Cell count" }, { tag: "td", className: "table-cell-2", html: "0–5/mm<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">3</span>" }, { tag: "td", className: "table-cell-3", html: "0–5 x 10<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">6</span>/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Chloride" }, { tag: "td", className: "table-cell-2", html: "118–132 mEq/L" }, { tag: "td", className: "table-cell-3", html: "118–132 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Gamma globulin" }, { tag: "td", className: "table-cell-2", html: "3%–12% total proteins" }, { tag: "td", className: "table-cell-3", html: "0.03–0.12" }],
    [{ tag: "td", className: "table-cell-1", html: "Glucose" }, { tag: "td", className: "table-cell-2", html: "40–70 mg/dL" }, { tag: "td", className: "table-cell-3", html: "2.2–3.9 mmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Pressure" }, { tag: "td", className: "table-cell-2", html: "70–180 mm H<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">2</span>O" }, { tag: "td", className: "table-cell-3", html: "70–180 mm H<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">2</span>O" }],
    [{ tag: "td", className: "table-cell-1", html: "Proteins, total" }, { tag: "td", className: "table-cell-2", html: "&lt;40 mg/dL" }, { tag: "td", className: "table-cell-3", html: "&lt;0.40 g/L" }],
  ],
  blood: [
    [{ tag: "th", className: "table-cell-header", html: "Hematologic" }, { tag: "th", className: "table-cell-header2", html: "Reference Range" }, { tag: "th", className: "table-cell-header3", html: "SI Reference" }],
    [{ tag: "td", className: "table-cell-1", html: "Erythrocyte count (RBC)" }, { tag: "td", className: "table-cell-2", html: "Male: 4.3–5.9 million/mm<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">3</span>" }, { tag: "td", className: "table-cell-3", html: "4.3–5.9 x 10<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">12</span>/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 3.5–5.5 million/mm<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">3</span>" }, { tag: "td", className: "table-cell-3", html: "3.5–5.5 x 10<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">12</span>/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Erythrocyte sedimentation rate (Westergren)" }, { tag: "td", className: "table-cell-2", html: "Male: 0–15 mm/h" }, { tag: "td", className: "table-cell-3", html: "0–15 mm/h" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 0–20 mm/h" }, { tag: "td", className: "table-cell-3", html: "0–20 mm/h" }],
    [{ tag: "td", className: "table-cell-1", html: "Hematocrit" }, { tag: "td", className: "table-cell-2", html: "Male: 41%–53%" }, { tag: "td", className: "table-cell-3", html: "0.41–0.53" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 36%–46%" }, { tag: "td", className: "table-cell-3", html: "0.36–0.46" }],
    [{ tag: "td", className: "table-cell-1", html: "Hemoglobin, blood" }, { tag: "td", className: "table-cell-2", html: "Male: 13.5–17.5 g/dL" }, { tag: "td", className: "table-cell-3", html: "135–175 g/L" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 12.0–16.0 g/dL" }, { tag: "td", className: "table-cell-3", html: "120–160 g/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Hemoglobin A1c" }, { tag: "td", className: "table-cell-2", html: "≤6%" }, { tag: "td", className: "table-cell-3", html: "≤42 mmol/mol" }],
    [{ tag: "td", className: "table-cell-1", html: "Leukocyte count (WBC)" }, { tag: "td", className: "table-cell-2", html: "4500–11,000/mm<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">3</span>" }, { tag: "td", className: "table-cell-3", html: "4.5–11.0 x 10<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">9</span>/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Neutrophils, segmented" }, { tag: "td", className: "table-cell-2", html: "54%–62%" }, { tag: "td", className: "table-cell-3", html: "0.54–0.62" }],
    [{ tag: "td", className: "table-cell-1", html: "Neutrophils, bands" }, { tag: "td", className: "table-cell-2", html: "3%–5%" }, { tag: "td", className: "table-cell-3", html: "0.03–0.05" }],
    [{ tag: "td", className: "table-cell-1", html: "Eosinophils" }, { tag: "td", className: "table-cell-2", html: "1%–3%" }, { tag: "td", className: "table-cell-3", html: "0.01–0.03" }],
    [{ tag: "td", className: "table-cell-1", html: "Basophils" }, { tag: "td", className: "table-cell-2", html: "0%–0.75%" }, { tag: "td", className: "table-cell-3", html: "0.00–0.0075" }],
    [{ tag: "td", className: "table-cell-1", html: "Lymphocytes" }, { tag: "td", className: "table-cell-2", html: "25%–33%" }, { tag: "td", className: "table-cell-3", html: "0.25–0.33" }],
    [{ tag: "td", className: "table-cell-1", html: "Monocytes" }, { tag: "td", className: "table-cell-2", html: "3%–7%" }, { tag: "td", className: "table-cell-3", html: "0.03–0.07" }],
    [{ tag: "td", className: "table-cell-1", html: "CD4+ T-lymphocyte count" }, { tag: "td", className: "table-cell-2", html: "≥500/mm<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">3</span>" }, { tag: "td", className: "table-cell-3", html: "≥0.5 x 10<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">9</span>/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Platelet count" }, { tag: "td", className: "table-cell-2", html: "150,000–400,000/mm<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">3</span>" }, { tag: "td", className: "table-cell-3", html: "150–400 x 10<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">9</span>/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Reticulocyte count" }, { tag: "td", className: "table-cell-2", html: "0.5%–1.5%" }, { tag: "td", className: "table-cell-3", html: "0.005–0.015" }],
    [{ tag: "td", className: "table-cell-1", html: "D-Dimer" }, { tag: "td", className: "table-cell-2", html: "≤250 ng/mL" }, { tag: "td", className: "table-cell-3", html: "≤1.4 nmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Partial thromboplastin time (aPTT) (activated)" }, { tag: "td", className: "table-cell-2", html: "25–40 seconds" }, { tag: "td", className: "table-cell-3", html: "25–40 seconds" }],
    [{ tag: "td", className: "table-cell-1", html: "Prothrombin time (PT)" }, { tag: "td", className: "table-cell-2", html: "11–15 seconds" }, { tag: "td", className: "table-cell-3", html: "11–15 seconds" }],
    [{ tag: "td", className: "table-cell-1", html: "Mean corpuscular hemoglobin (MCH)" }, { tag: "td", className: "table-cell-2", html: "25–35 pg/cell" }, { tag: "td", className: "table-cell-3", html: "0.39–0.54 fmol/cell" }],
    [{ tag: "td", className: "table-cell-1", html: "Mean corpuscular hemoglobin concentration (MCHC)" }, { tag: "td", className: "table-cell-2", html: "31%–36% Hb/cell" }, { tag: "td", className: "table-cell-3", html: "4.8–5.6 mmol Hb/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Mean corpuscular volume (MCV)" }, { tag: "td", className: "table-cell-2", html: "80–100 µm<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">3</span>" }, { tag: "td", className: "table-cell-3", html: "80–100 fL" }],
    [{ tag: "td", className: "table-cell-header", html: "Volume" }, { tag: "td", className: "table-cell-2", html: "" }, { tag: "td", className: "table-cell-3", html: "" }],
    [{ tag: "td", className: "table-cell-1", html: "Plasma" }, { tag: "td", className: "table-cell-2", html: "Male: 25–43 mL/kg" }, { tag: "td", className: "table-cell-3", html: "0.025–0.043 L/kg" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 28–45 mL/kg" }, { tag: "td", className: "table-cell-3", html: "0.028–0.045 L/kg" }],
    [{ tag: "td", className: "table-cell-1", html: "Red cell" }, { tag: "td", className: "table-cell-2", html: "Male: 20–36 mL/kg" }, { tag: "td", className: "table-cell-3", html: "0.020–0.036 L/kg" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 19–31 mL/kg" }, { tag: "td", className: "table-cell-3", html: "0.019–0.031 L/kg" }],
  ],
  urine: [
    [{ tag: "th", className: "table-cell-header", html: "Urine" }, { tag: "th", className: "table-cell-header2", html: "Reference Range" }, { tag: "th", className: "table-cell-header3", html: "SI Reference" }],
    [{ tag: "td", className: "table-cell-1", html: "Calcium" }, { tag: "td", className: "table-cell-2", html: "100–300 mg/24 h" }, { tag: "td", className: "table-cell-3", html: "2.5–7.5 mmol/24 h" }],
    [{ tag: "td", className: "table-cell-1", html: "Osmolality" }, { tag: "td", className: "table-cell-2", html: "50–1200 mOsmol/kg H<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">2</span>O" }, { tag: "td", className: "table-cell-3", html: "50–1200 mOsmol/kg H<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:3pt\">2</span>O" }],
    [{ tag: "td", className: "table-cell-1", html: "Oxalate" }, { tag: "td", className: "table-cell-2", html: "8–40 µg/mL" }, { tag: "td", className: "table-cell-3", html: "90–445 µmol/L" }],
    [{ tag: "td", className: "table-cell-1", html: "Proteins, total" }, { tag: "td", className: "table-cell-2", html: "&lt;150 mg/24 h" }, { tag: "td", className: "table-cell-3", html: "&lt;0.15 g/24 h" }],
    [{ tag: "td", className: "table-cell-1", html: "17-Hydroxycorticosteroids" }, { tag: "td", className: "table-cell-2", html: "Male: 3.0–10.0 mg/24 h" }, { tag: "td", className: "table-cell-3", html: "8.2–27.6 µmol/24 h" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 2.0–8.0 mg/24 h" }, { tag: "td", className: "table-cell-3", html: "5.5–22.0 µmol/24 h" }],
    [{ tag: "td", className: "table-cell-1", html: "17-Ketosteroids, total" }, { tag: "td", className: "table-cell-2", html: "Male: 8–20 mg/24 h" }, { tag: "td", className: "table-cell-3", html: "28–70 µmol/24 h" }],
    [{ tag: "td", className: "table-cell-1", html: "" }, { tag: "td", className: "table-cell-2", html: "Female: 6–15 mg/24 h" }, { tag: "td", className: "table-cell-3", html: "21–52 µmol/24 h" }],
    [{ tag: "td", className: "table-cell-header", html: "Body Mass Index (BMI)" }, { tag: "td", className: "table-cell-2", html: "Adult: 19–25 kg/m<span style=\"font-size:7pt;left:1pt;font-family:Arial, Verdana, 'MS Sans Serif';position:relative;top:-3pt\">2</span>" }, { tag: "td", className: "table-cell-3", html: "" }],
  ],
};

const stripMarkup = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");

export const LabValues = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<LabTab>("serum");
  const [query, setQuery] = useState("");
  const [showSI, setShowSI] = useState(false);

  const rows = sourceLabTables[tab];

  const matchingRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return null;

    return new Set(
      rows
        .map((row, index) => {
          const haystack = row.map((cell) => stripMarkup(cell.html)).join(" ").toLowerCase();
          return haystack.includes(needle) ? index : -1;
        })
        .filter((index) => index >= 0)
    );
  }, [query, rows]);

  const panel = open
    ? createPortal(
        <aside className="source-lab-panel" aria-label="Laboratory values">
          <div className="source-lab-top-panel">
            <div className="source-lab-close-row">
              <button
                className="source-lab-close-button"
                type="button"
                aria-label="Close"
                title="Close"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="source-lab-controls">
              <div className="source-lab-search-wrapper">
                <input
                  id="source-lab-search"
                  aria-label="Search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                />
                {query ? (
                  <button
                    className="source-lab-clear"
                    type="button"
                    aria-label="Clear"
                    onClick={() => setQuery("")}
                  >
                    ×
                  </button>
                ) : null}
              </div>

              <span className="source-lab-interval">
                <input
                  id="source-lab-intervals"
                  type="checkbox"
                  checked={showSI}
                  onChange={(event) => setShowSI(event.target.checked)}
                />
                <label htmlFor="source-lab-intervals">SI Reference Intervals</label>
              </span>
            </div>

            <ul className="source-lab-tabs" role="tablist" aria-label="Laboratory value categories">
              {tabs.map((item) => (
                <li
                  key={item.id}
                  role="tab"
                  aria-selected={tab === item.id}
                  tabIndex={tab === item.id ? 0 : -1}
                  className={tab === item.id ? "active" : ""}
                  title={item.label}
                  onClick={() => setTab(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setTab(item.id);
                    }
                  }}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="source-lab-container">
            <table className="source-lab-table" cellSpacing={0} cellPadding={5}>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={`${tab}-${rowIndex}`}
                    className={matchingRows?.has(rowIndex) ? "source-lab-searched-row" : undefined}
                  >
                    {row.map((cell, cellIndex) => {
                      const CellTag = cell.tag;
                      const isSI = cellIndex === 2;
                      return (
                        <CellTag
                          key={`${rowIndex}-${cellIndex}`}
                          className={`${cell.className}${isSI && showSI ? " isVisible" : ""}`}
                          dangerouslySetInnerHTML={{ __html: cell.html }}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        className="classic-tool-trigger"
        title="Lab Values"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="classic-bottom-icon">
          <PanelsTopLeft size={17} strokeWidth={2.1} />
        </span>
        <span>Lab Values</span>
      </button>
      {panel}
    </>
  );
};