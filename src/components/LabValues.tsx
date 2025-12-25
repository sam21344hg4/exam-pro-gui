import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LabValues = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <FlaskConical className="h-4 w-4" />
          <span className="hidden sm:inline">Lab Values</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Reference Laboratory Values</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {/* Serum */}
            <section>
              <h3 className="font-semibold text-primary border-b pb-1 mb-3">Serum</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <LabRow label="Sodium" value="136-145 mEq/L" />
                <LabRow label="Potassium" value="3.5-5.0 mEq/L" />
                <LabRow label="Chloride" value="98-106 mEq/L" />
                <LabRow label="Bicarbonate" value="23-28 mEq/L" />
                <LabRow label="BUN" value="7-20 mg/dL" />
                <LabRow label="Creatinine" value="0.6-1.2 mg/dL" />
                <LabRow label="Glucose (fasting)" value="70-100 mg/dL" />
                <LabRow label="Calcium" value="8.4-10.2 mg/dL" />
                <LabRow label="Magnesium" value="1.5-2.0 mEq/L" />
                <LabRow label="Phosphorus" value="3.0-4.5 mg/dL" />
                <LabRow label="Uric acid" value="3.0-8.2 mg/dL" />
                <LabRow label="Total protein" value="6.0-7.8 g/dL" />
                <LabRow label="Albumin" value="3.5-5.5 g/dL" />
                <LabRow label="Bilirubin (total)" value="0.1-1.0 mg/dL" />
                <LabRow label="Bilirubin (direct)" value="0.0-0.3 mg/dL" />
                <LabRow label="AST (SGOT)" value="10-40 U/L" />
                <LabRow label="ALT (SGPT)" value="7-56 U/L" />
                <LabRow label="Alkaline phosphatase" value="44-147 U/L" />
                <LabRow label="Amylase" value="25-125 U/L" />
                <LabRow label="Lipase" value="10-140 U/L" />
              </div>
            </section>

            {/* Hematology */}
            <section>
              <h3 className="font-semibold text-primary border-b pb-1 mb-3">Hematology</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <LabRow label="Hemoglobin (M)" value="14-18 g/dL" />
                <LabRow label="Hemoglobin (F)" value="12-16 g/dL" />
                <LabRow label="Hematocrit (M)" value="40-54%" />
                <LabRow label="Hematocrit (F)" value="37-47%" />
                <LabRow label="RBC (M)" value="4.5-5.5 million/μL" />
                <LabRow label="RBC (F)" value="4.0-5.0 million/μL" />
                <LabRow label="MCV" value="80-100 fL" />
                <LabRow label="MCH" value="27-33 pg" />
                <LabRow label="MCHC" value="32-36 g/dL" />
                <LabRow label="RDW" value="11.5-14.5%" />
                <LabRow label="WBC" value="4,500-11,000/μL" />
                <LabRow label="Platelets" value="150,000-400,000/μL" />
                <LabRow label="Reticulocyte count" value="0.5-2.5%" />
                <LabRow label="ESR (M)" value="0-15 mm/hr" />
                <LabRow label="ESR (F)" value="0-20 mm/hr" />
              </div>
            </section>

            {/* Coagulation */}
            <section>
              <h3 className="font-semibold text-primary border-b pb-1 mb-3">Coagulation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <LabRow label="PT" value="11-15 seconds" />
                <LabRow label="INR" value="0.8-1.2" />
                <LabRow label="PTT" value="25-35 seconds" />
                <LabRow label="Bleeding time" value="2-7 minutes" />
                <LabRow label="Fibrinogen" value="200-400 mg/dL" />
                <LabRow label="D-dimer" value="<500 ng/mL" />
              </div>
            </section>

            {/* Lipids */}
            <section>
              <h3 className="font-semibold text-primary border-b pb-1 mb-3">Lipid Panel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <LabRow label="Total cholesterol" value="<200 mg/dL" />
                <LabRow label="LDL cholesterol" value="<100 mg/dL" />
                <LabRow label="HDL cholesterol (M)" value=">40 mg/dL" />
                <LabRow label="HDL cholesterol (F)" value=">50 mg/dL" />
                <LabRow label="Triglycerides" value="<150 mg/dL" />
              </div>
            </section>

            {/* Thyroid */}
            <section>
              <h3 className="font-semibold text-primary border-b pb-1 mb-3">Thyroid</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <LabRow label="TSH" value="0.5-5.0 μU/mL" />
                <LabRow label="Free T4" value="0.7-1.9 ng/dL" />
                <LabRow label="Total T3" value="80-200 ng/dL" />
              </div>
            </section>

            {/* ABG */}
            <section>
              <h3 className="font-semibold text-primary border-b pb-1 mb-3">Arterial Blood Gas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <LabRow label="pH" value="7.35-7.45" />
                <LabRow label="PaO2" value="80-100 mmHg" />
                <LabRow label="PaCO2" value="35-45 mmHg" />
                <LabRow label="HCO3" value="22-28 mEq/L" />
                <LabRow label="O2 saturation" value="95-100%" />
              </div>
            </section>

            {/* CSF */}
            <section>
              <h3 className="font-semibold text-primary border-b pb-1 mb-3">Cerebrospinal Fluid</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <LabRow label="Opening pressure" value="70-180 mm H2O" />
                <LabRow label="Glucose" value="40-70 mg/dL" />
                <LabRow label="Protein" value="15-45 mg/dL" />
                <LabRow label="WBC" value="0-5 cells/μL" />
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const LabRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-1 px-2 rounded hover:bg-muted/50">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);
