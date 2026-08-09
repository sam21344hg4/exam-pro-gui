import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PanelsTopLeft, X } from "lucide-react";

type LabEntry = ["section" | "group" | "item", string, string, string];
type LabTab = "serum" | "cerebrospinal" | "blood" | "urine";

const labEntries: LabEntry[] = [
  ["section", "SERUM", "Reference Range", "SI Reference Intervals"],
  ["group", "General Chemistry", "", ""],
  ["group", "Electrolytes", "", ""],
  ["item", "Sodium (Na + )", "136–146 mEq/L", "136–146 mmol/L"],
  ["item", "Potassium (K + )", "3.5–5.0 mEq/L", "3.5–5.0 mmol/L"],
  ["item", "Chloride (Cl – )", "95–105 mEq/L", "95–105 mmol/L"],
  ["item", "Bicarbonate (HCO 3 – )", "22–28 mEq/L", "22–28 mmol/L"],
  ["item", "Urea nitrogen", "7–18 mg/dL", "2.5–6.4 mmol/L"],
  ["item", "Creatinine", "0.6–1.2 mg/dL", "53–106 μmol/L"],
  ["item", "Glucose", "Fasting: 70–100 mg/dL", "3.8–5.6 mmol/L"],
  ["item", "", "Random, non-fasting: <140 mg/dL", "<7.8 mmol/L"],
  ["item", "Calcium", "8.4–10.2 mg/dL", "2.1–2.6 mmol/L"],
  ["item", "Magnesium (Mg 2+ )", "1.5–2.0 mg/dL", "0.75–1.0 mmol/L"],
  ["item", "Phosphorus (inorganic)", "3.0–4.5 mg/dL", "1.0–1.5 mmol/L"],
  ["group", "Hepatic", "", ""],
  ["item", "Alanine aminotransferase (ALT)", "10–40 U/L", "10–40 U/L"],
  ["item", "Aspartate aminotransferase (AST)", "12–38 U/L", "12–38 U/L"],
  ["item", "Alkaline phosphatase", "25–100 U/L", "25–100 U/L"],
  ["item", "Bilirubin, Total // Direct", "0.1–1.0 mg/dL // 0.0–0.3 mg/dL", "2–17 μmol/L // 0–5 μmol/L"],
  ["item", "Proteins, total", "6.0–7.8 g/dL", "60–78 g/L"],
  ["item", "Albumin", "3.5–5.5 g/dL", "35–55 g/L"],
  ["item", "Globulin", "2.3–3.5 g/dL", "23–35 g/L"],
  ["group", "Other, Serum", "", ""],
  ["item", "Amylase", "25–125 U/L", "25–125 U/L"],
  ["item", "Lipase", "13–60 U/L", "13–60 U/L"],
  ["item", "Creatinine clearance", "Male: 97–137 mL/min", "97–137 mL/min"],
  ["item", "", "Female: 88–128 mL/min", "88–128 mL/min"],
  ["item", "Creatine kinase", "Male: 25–90 U/L", "25–90 U/L"],
  ["item", "", "Female: 10–70 U/L", "10–70 U/L"],
  ["item", "Lactate dehydrogenase", "45–200 U/L", "45–200 U/L"],
  ["item", "Osmolality", "275–295 mOsmol/kg H 2 O", "275–295 mOsmol/kg H 2 O"],
  ["item", "Troponin I", "≤0.04 ng/mL", "≤0.04 µg/L"],
  ["item", "Uric acid", "3.0–8.2 mg/dL", "0.18–0.48 mmol/L"],
  ["group", "Lipids", "", ""],
  ["item", "Cholesterol, total", "Normal: <200 mg/dL", "<5.2 mmol/L"],
  ["item", "", "High: >240 mg/dL", ">6.2 mmol/L"],
  ["item", "HDL", "40–60 mg/dL", "1.0–1.6 mmol/L"],
  ["item", "LDL", "<160 mg/dL", "<4.2 mmol/L"],
  ["item", "Triglycerides", "Normal: <150 mg/dL", "<1.70 mmol/L"],
  ["item", "", "Borderline: 151–199 mg/dL", "1.71–2.25 mmol/L"],
  ["group", "Iron Studies", "", ""],
  ["item", "Ferritin", "Male: 20–250 ng/mL", "20–250 μg/L"],
  ["item", "", "Female: 10–120 ng/mL", "10–120 μg/L"],
  ["item", "Iron", "Male: 65–175 µg/dL", "11.6–31.3 μmol/L"],
  ["item", "", "Female: 50–170 μg/dL", "9.0–30.4 μmol/L"],
  ["item", "Total iron-binding capacity", "250–400 µg/dL", "44.8–71.6 μmol/L"],
  ["item", "Transferrin", "200–360 mg/dL", "2.0–3.6 g/L"],
  ["group", "Endocrine", "", ""],
  ["item", "Follicle-stimulating hormone", "Male: 4–25 mIU/mL", "4–25 IU/L"],
  ["item", "", "Female: premenopause 4–30 mIU/mL", "4–30 IU/L"],
  ["item", "", "midcycle peak 10–90 mIU/mL", "10–90 IU/L"],
  ["item", "", "postmenopause 40–250 mIU/mL", "40–250 IU/L"],
  ["item", "Luteinizing hormone", "Male: 6–23 mIU/mL", "6–23 IU/L"],
  ["item", "", "Female: follicular phase 5–30 mIU/mL", "5–30 IU/L"],
  ["item", "", "midcycle 75–150 mIU/mL", "75–150 IU/L"],
  ["item", "", "postmenopause 30–200 mIU/mL", "30–200 IU/L"],
  ["item", "Growth hormone - arginine stimulation", "Fasting: <5 ng/mL", "<5 μg/L"],
  ["item", "", "Provocative stimuli: >7 ng/mL", ">7 μg/L"],
  ["item", "Prolactin (hPRL)", "Male: <17 ng/mL", "<17 μg/L"],
  ["item", "", "Female: <25 ng/mL", "<25 μg/L"],
  ["item", "Cortisol", "0800 h: 5–23 μg/dL", "138–635 nmol/L"],
  ["item", "", "1600 h: 3–15 μg/dL", "82–413 nmol/L"],
  ["item", "", "2000 h: <50% of 0800 h", "Fraction of 0800 h: <0.50"],
  ["item", "Thyroid-stimulating hormone (TSH)", "0.4–4.0 μU/mL", "0.4–4.0 mIU/L"],
  ["item", "Triiodothyronine (T 3 ) (RIA)", "100–200 ng/dL", "1.5–3.1 nmol/L"],
  ["item", "Triiodothyronine (T 3 ) resin uptake", "25%–35%", "0.25–0.35"],
  ["item", "Thyroxine (T 4 )", "5–12 μg/dL", "64–155 nmol/L"],
  ["item", "Free T 4", "0.9–1.7 ng/dL", "12.0–21.9 pmol/L"],
  ["item", "Thyroidal iodine ( 123 I) uptake", "8%–30% of administered dose/24 h", "0.08–0.30/24 h"],
  ["item", "Intact parathyroid hormone (PTH)", "10–60 pg/mL", "10–60 ng/L"],
  ["item", "17-Hydroxycorticosteroids", "Male: 3.0–10.0 mg/24 h", "8.2–27.6 μmol/24 h"],
  ["item", "", "Female: 2.0–8.0 mg/24 h", "5.5–22.0 μmol/24 h"],
  ["item", "17-Ketosteroids, total", "Male: 8–20 mg/24 h", "28–70 μmol/24 h"],
  ["item", "", "Female: 6–15 mg/24 h", "21–52 μmol/24 h"],
  ["group", "Immunoglobulins", "", ""],
  ["item", "IgA", "76–390 mg/dL", "0.76–3.90 g/L"],
  ["item", "IgE", "0–380 IU/mL", "0–380 kIU/L"],
  ["item", "IgG", "650–1500 mg/dL", "6.5–15.0 g/L"],
  ["item", "IgM", "50–300 mg/dL", "0.5–3.0 g/L"],
  ["section", "GASES, ARTERIAL BLOOD (ROOM AIR)", "Reference Range", "SI Reference Intervals"],
  ["item", "PO 2", "75–105 mm Hg", "10.0–14.0 kPa"],
  ["item", "PCO 2", "33–45 mm Hg", "4.4–5.9 kPa"],
  ["item", "pH", "7.35–7.45", "[H + ] 36–44 nmol/L"],
  ["section", "CEREBROSPINAL FLUID", "Reference Range", "SI Reference Intervals"],
  ["item", "Cell count", "0–5/mm 3", "0–5 × 10 6 /L"],
  ["item", "Chloride", "118–132 mEq/L", "118–132 mmol/L"],
  ["item", "Gamma globulin", "3%–12% total proteins", "0.03–0.12"],
  ["item", "Glucose", "40–70 mg/dL", "2.2–3.9 mmol/L"],
  ["item", "Pressure", "70–180 mm H 2 O", "70–180 mm H 2 O"],
  ["item", "Proteins, total", "<40 mg/dL", "<0.40 g/L"],
  ["section", "HEMATOLOGIC", "Reference Range", "SI Reference Intervals"],
  ["group", "Complete Blood Count", "", ""],
  ["item", "Hematocrit", "Male: 41%–53%", "0.41–0.53"],
  ["item", "", "Female: 36%–46%", "0.36–0.46"],
  ["item", "Hemoglobin, blood", "Male: 13.5–17.5 g/dL", "135–175 g/L"],
  ["item", "", "Female: 12.0–16.0 g/dL", "120–160 g/L"],
  ["item", "Mean corpuscular hemoglobin (MCH)", "25–35 pg/cell", "0.39–0.54 fmol/cell"],
  ["item", "Mean corpuscular hemoglobin conc. (MCHC)", "31%–36% Hb/cell", "4.8–5.6 mmol Hb/L"],
  ["item", "Mean corpuscular volume (MCV)", "80–100 μm 3", "80–100 fL"],
  ["group", "Volume", "", ""],
  ["item", "Plasma", "Male: 25–43 mL/kg", "0.025–0.043 L/kg"],
  ["item", "", "Female: 28–45 mL/kg", "0.028–0.045 L/kg"],
  ["item", "Red cell", "Male: 20–36 mL/kg", "0.020–0.036 L/kg"],
  ["item", "", "Female: 19–31 mL/kg", "0.019–0.031 L/kg"],
  ["item", "Leukocyte count (WBC)", "4500–11,000/mm 3", "4.5–11.0 × 10 9 /L"],
  ["item", "Neutrophils, segmented", "54%–62%", "0.54–0.62"],
  ["item", "Neutrophils, bands", "3%–5%", "0.03–0.05"],
  ["item", "Lymphocytes", "25%–33%", "0.25–0.33"],
  ["item", "Monocytes", "3%–7%", "0.03–0.07"],
  ["item", "Eosinophils", "1%–3%", "0.01–0.03"],
  ["item", "Basophils", "0%–0.75%", "0.00–0.0075"],
  ["item", "Platelet count", "150,000–400,000/mm 3", "150–400 × 10 9 /L"],
  ["group", "Coagulation", "", ""],
  ["item", "Partial thromboplastin time (PTT) (activated)", "25–40 seconds", "25–40 seconds"],
  ["item", "Prothrombin time (PT)", "11–15 seconds", "11–15 seconds"],
  ["item", "D-Dimer", "≤250 ng/mL", "≤1.4 nmol/L"],
  ["group", "Other, Hematologic", "", ""],
  ["item", "Reticulocyte count", "0.5%–1.5%", "0.005–0.015"],
  ["item", "Erythrocyte count", "Male: 4.3–5.9 million/mm 3", "4.3–5.9 × 10 12 /L"],
  ["item", "", "Female: 3.5–5.5 million/mm 3", "3.5–5.5 × 10 12 /L"],
  ["item", "Erythrocyte sedimentation rate (Westergren)", "Male: 0–15 mm/h", "0–15 mm/h"],
  ["item", "", "Female: 0–20 mm/h", "0–20 mm/h"],
  ["item", "CD4+ T-lymphocyte count", "≥500/mm 3", "≥0.5 × 10 9 /L"],
  ["group", "Endocrine", "", ""],
  ["item", "Hemoglobin A1c", "≤6%", "≤42 mmol/mol"],
  ["section", "URINE", "Reference Range", "SI Reference Intervals"],
  ["item", "Calcium", "100–300 mg/24 h", "2.5–7.5 mmol/24 h"],
  ["item", "Osmolality", "50–1200 mOsmol/kg H 2 O", "50–1200 mOsmol/kg H 2 O"],
  ["item", "Oxalate", "8–40 μg/mL", "90–445 μmol/L"],
  ["item", "Proteins, total", "<150 mg/24 h", "<0.15 g/24 h"],
  ["item", "BODY MASS INDEX (BMI)", "Adult: 19–25 kg/m 2", ""],
];

const tabForSection = (section: string): LabTab => {
  if (section.includes("CEREBROSPINAL")) return "cerebrospinal";
  if (section.includes("HEMATOLOGIC") || section.includes("ARTERIAL BLOOD")) return "blood";
  if (section.includes("URINE")) return "urine";
  return "serum";
};

const tabs: Array<{ id: LabTab; label: string }> = [
  { id: "serum", label: "Serum" },
  { id: "cerebrospinal", label: "Cerebrospinal" },
  { id: "blood", label: "Blood" },
  { id: "urine", label: "Urine and BMI" },
];

export const LabValues = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<LabTab>("serum");
  const [query, setQuery] = useState("");
  const [showSI, setShowSI] = useState(false);

  const visibleEntries = useMemo(() => {
    let currentTab: LabTab = "serum";
    const inTab: LabEntry[] = [];

    labEntries.forEach((entry) => {
      if (entry[0] === "section") currentTab = tabForSection(entry[1]);
      if (currentTab === tab) inTab.push(entry);
    });

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return inTab;

    return inTab.filter(([type, name, reference, si]) => {
      if (type !== "item") return false;
      return `${name} ${reference} ${si}`.toLowerCase().includes(normalizedQuery);
    });
  }, [query, tab]);

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <button type="button" className="classic-tool-trigger" title="Lab Values">
          <span className="classic-bottom-icon"><PanelsTopLeft size={17} strokeWidth={2.1} /></span>
          <span>Lab Values</span>
        </button>
      </DialogTrigger>

      <DialogContent
        className="classic-reference-dialog classic-lab-docked-panel"
        aria-describedby={undefined}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className="classic-reference-titlebar classic-lab-docked-titlebar">
          <span className="sr-only">Laboratory Values</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close laboratory values">
            <X size={18} />
          </button>
        </div>

        <div className="classic-lab-toolbar">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search laboratory values"
          />
          <label>
            <input type="checkbox" checked={showSI} onChange={(event) => setShowSI(event.target.checked)} />
            <span>SI Reference Intervals</span>
          </label>
        </div>

        <div className="classic-lab-tabs" role="tablist" aria-label="Laboratory value categories">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={tab === item.id ? "is-active" : ""}
              onClick={() => {
                setTab(item.id);
                setQuery("");
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="classic-lab-scroll classic-lab-docked-scroll">
          <table className="classic-lab-table classic-lab-docked-table">
            <tbody>
              {visibleEntries.map(([type, name, reference, si], index) => {
                if (type === "section") {
                  return (
                    <tr className="classic-lab-section" key={`${name}-${index}`}>
                      <th>{name}</th>
                      <th>{showSI ? "SI Reference Intervals" : "Reference Range"}</th>
                    </tr>
                  );
                }

                if (type === "group") {
                  return (
                    <tr className="classic-lab-group" key={`${name}-${index}`}>
                      <th colSpan={2}>{name}</th>
                    </tr>
                  );
                }

                return (
                  <tr key={`${name}-${reference}-${index}`}>
                    <td>{name}</td>
                    <td>{showSI ? si || reference : reference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
