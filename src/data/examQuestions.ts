export interface Question {
  id: number;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  educationalObjective: string;
}

export const examQuestions: Question[] = [
  {
    id: 1,
    stem: "A 12-year-old boy is admitted to the hospital because of lethargy, hip pain, and a temperature of 39.4°C (103°F). He has been hospitalized several other times because of pneumonia. His neonatal period was normal. Complete blood counts are within normal limits, and a test for HIV antibody is negative. Blood cultures grow Staphylococcus aureus. Serum electrophoresis is most likely to show which of the following patterns?",
    options: [
      { label: "A", text: "Narrow monoclonal spike in the gamma region" },
      { label: "B", text: "Blurring (fusion) of the beta-2 and gamma regions" },
      { label: "C", text: "Broad-based increase (polyclonal) in the gamma region" },
      { label: "D", text: "Deficiency of immunoglobulins (absent gamma fraction)" },
      { label: "E", text: "Normal serum protein electrophoresis pattern" },
    ],
    correctAnswer: "D",
    explanation: "The electrophoresis pattern in Choice D demonstrates a deficiency of immunoglobulins. This young patient with Staphylococcus aureus bacteremia and a history of multiple prior infections has a clinical syndrome consistent with hypogammaglobulinemia (an immunodeficiency), which is reflected by the absence of the gamma fraction on serum protein electrophoresis.\n\nSerum protein electrophoresis separates major serum proteins by size and charge:\n\n• Albumin: Largest peak (left side of the diagram); migrates toward the positive pole (most negative charge).\n• Alpha fraction: Next peak; mainly α1-antitrypsin, thyroid-binding globulin, and transcortin.\n• Beta fraction: Contains transferrin, β-lipoproteins, and complement proteins.\n• Gamma fraction: Contains immunoglobulins (IgM, IgG, IgD, IgE). In hypogammaglobulinemia, there is a marked reduction or absence of this gamma spike.",
    educationalObjective: "Serum protein electrophoresis separates blood proteins based on charge and size. Abnormal electrophoresis patterns help identify disease states. The absence of a gamma spike indicates immunodeficiency due to hypogammaglobulinemia or agammaglobulinemia.",
  },
  {
    id: 2,
    stem: "Free purine and pyrimidine bases are reutilized in normal metabolism. In children with Lesch-Nyhan syndrome who have intellectual disability, poor muscle coordination, and self-mutilation tendencies, there is a defect in the salvage of which of the following pairs of bases?",
    options: [
      { label: "A", text: "Adenine and thymine" },
      { label: "B", text: "Guanine and hypoxanthine" },
      { label: "C", text: "Guanine and uric acid" },
      { label: "D", text: "Uracil and cytosine" },
      { label: "E", text: "Xanthine and hypoxanthine" },
    ],
    correctAnswer: "B",
    explanation: "Lesch-Nyhan syndrome presents with intellectual disability, aggressive behavior, self-mutilation, gout, and dystonia. The disorder is due to inactivating mutations of hypoxanthine-guanine phosphoribosyltransferase (HGPRT), a key enzyme in the purine salvage pathway, and is inherited in an X-linked recessive fashion.\n\nHGPRT catalyzes the conversion of guanine to guanosine monophosphate and hypoxanthine to inosine monophosphate. Patients with deficient activity of HGPRT are unable to salvage guanine and hypoxanthine and develop resultant increased levels of xanthine and uric acid.",
    educationalObjective: "Lesch-Nyhan syndrome presents with intellectual disability, aggressive behavior, self-mutilation, gout, and dystonia. Mutations in HGPRT cause this disorder by impairing salvage of the purines guanine and hypoxanthine, which leads to increased levels of xanthine and uric acid.",
  },
  {
    id: 3,
    stem: "A 42-year-old man is struck by a motor vehicle. His only injury is a closed fracture of the proximal tibia. Initial neurovascular examination shows no deficits. 24 hours later, he has increased leg pain and paresthesias in the dorsal space between his first and second toes. The patient begins to pass dark red urine and becomes oliguric. Urinalysis is positive for blood, but no erythrocytes are seen on microscopic examination. Which of the following acute disorders is the most likely cause of the renal failure?",
    options: [
      { label: "A", text: "Glomerulonephritis" },
      { label: "B", text: "Hemolytic-uremic syndrome" },
      { label: "C", text: "Interstitial nephritis" },
      { label: "D", text: "Nephrotic syndrome" },
      { label: "E", text: "Tubular necrosis" },
    ],
    correctAnswer: "E",
    explanation: "Tibial fractures present a high risk for compartment syndrome. The fracture results in blood vessel injury and muscle injury, inflammation, and edema. Because the fascia containing the anterior compartment of the leg does not stretch, bleeding and swelling can cause increased pressure in the compartment.\n\nMuscle necrosis leads to rhabdomyolysis, myoglobinuria, and acute renal failure. Evaluation of rhabdomyolysis reveals red or brown urine and urinalysis is typically positive for blood due to the presence of myoglobinuria without microscopic evidence of red blood cells.\n\nAcute tubular necrosis typically occurs following an ischemic or nephrotoxic insult to the kidneys, which results in loss of the tubular epithelium. Granular, muddy brown casts are common on urinalysis.",
    educationalObjective: "Tibial fractures can be complicated by compartment syndrome due to increased compartment pressure in the anterior leg. Compartment syndrome leading to muscle necrosis and rhabdomyolysis can be complicated by acute tubular necrosis due to the nephrotoxicity of myoglobin and its byproducts.",
  },
  {
    id: 4,
    stem: "A male newborn is found to have a defect in anchoring fibrils. Which of the following skin findings is most likely in this patient?",
    options: [
      { label: "A", text: "Blisters" },
      { label: "B", text: "Easy bruising" },
      { label: "C", text: "Eczematous rash" },
      { label: "D", text: "Inability to sweat" },
      { label: "E", text: "Thickened skin" },
      { label: "F", text: "Ulcers" },
    ],
    correctAnswer: "A",
    explanation: "The hemidesmosome is an intricate complex of proteins whose ultimate function is to anchor the basal keratinocytes of the epidermis to the dermis at the dermal-epidermal junction. Any impairment of the hemidesmosome will cause the basal keratinocytes to separate from the dermis, causing a blister to form.\n\nAnchoring fibrils are made of type VII collagen and are a component of the hemidesmosome. A mutation or antibody to collagen type VII, as seen in epidermolysis bullosa, will cause blistering to occur. Bullous pemphigoid is another disease which affects the hemidesmosome.",
    educationalObjective: "A defect in any part of the hemidesmosome, including the anchoring fibrils, will result in blister formation. Epidermolysis bullosa is characterized by antibodies against or a mutation of the anchoring fibrils.",
  },
  {
    id: 5,
    stem: "A 65-year-old woman has ascites. Which of the following additional findings indicates a diagnosis of constrictive pericarditis rather than cirrhosis?",
    options: [
      { label: "A", text: "Edema of the lower extremities" },
      { label: "B", text: "Esophageal varices" },
      { label: "C", text: "Hypoalbuminemia" },
      { label: "D", text: "Hyponatremia" },
      { label: "E", text: "Increased jugular venous pressure" },
      { label: "F", text: "Splenomegaly" },
    ],
    correctAnswer: "E",
    explanation: "Increased jugular venous pressure (JVP) is an expected finding in constrictive pericarditis (CP) and would not be found in patients with volume overload secondary to cirrhosis. CP describes a pathologic state whereby the pericardium, which encases the entirety of the heart and the origins of the great vessels, loses its elasticity.\n\nThe constricted pericardium does not respond to normal changes in intrathoracic pressure during inspiration. CP ultimately results in equalization of pressures in all four chambers, with clinical evidence of right heart failure exhibited by an increased JVP on physical examination.",
    educationalObjective: "Constrictive pericarditis (CP) results from the loss of the normal elasticity of the pericardium, which causes interventricular interdependence and equalization of pressures throughout the heart with impaired diastolic filling. Increased jugular venous pressure (JVP) is often seen on physical examination.",
  },
  {
    id: 6,
    stem: "A 62-year-old man is being evaluated for rectal bleeding. An x-ray of the gastrointestinal tract with contrast material is shown. Which of the following is the most likely explanation for the feathery appearance in the portion of the gastrointestinal tract indicated by X when compared with the portion indicated by Y?",
    options: [
      { label: "A", text: "Absence of circular muscle" },
      { label: "B", text: "Fewer villi" },
      { label: "C", text: "Greater bowel motility" },
      { label: "D", text: "Greater mucosal surface area" },
      { label: "E", text: "Less circular and longitudinal smooth muscle" },
    ],
    correctAnswer: "D",
    explanation: "The jejunum (X) can be distinguished from the ileum (Y) by several characteristic features. The inner mucosal folds, or plicae circulares, are more prominent, more numerous, and taller in the jejunum compared to the ileum. This leads to an increased mucosal surface area and an associated feathered appearance after the administration of oral contrast material.\n\nThe jejunum also shows a larger caliber, thicker muscular walls, longer vasa rectae, and fewer arcades. The ileum is notable for the presence of Peyer patches and mucosal lymphoid follicles.",
    educationalObjective: "The jejunum possesses several characteristic features, including prominent plicae circulares, which lends the jejunum an increased mucosal surface area and a feathered appearance with oral contrast material.",
  },
  {
    id: 7,
    stem: "A 65-year-old man who has chronic lymphocytic leukemia has the sudden onset of fatigue and shortness of breath. Laboratory studies show decreased hemoglobin, increased bilirubin, and increased reticulocyte count. A peripheral blood smear shows spherocytes. Which of the following is the most likely cause of the anemia?",
    options: [
      { label: "A", text: "Aplastic anemia" },
      { label: "B", text: "Autoimmune hemolysis" },
      { label: "C", text: "Hereditary spherocytosis" },
      { label: "D", text: "Microangiopathic hemolysis" },
      { label: "E", text: "Monoclonal gammopathy" },
    ],
    correctAnswer: "B",
    explanation: "Autoimmune hemolysis explains this patient's anemia, unconjugated hyperbilirubinemia, reticulocytosis (large blue-colored erythrocytes), and spherocytes on the peripheral smear.\n\nAutoimmune hemolytic anemia (AIHA) occurs due to production of antibodies targeting circulating red blood cell (RBC) surface antigens, marking them for removal in the reticuloendothelial system (RES) or fixing complement leading to intravascular hemolysis.\n\nIgG antibodies are active at the physiologic temperature of the human body (called \"warm AIHA\"); these do not routinely activate complement. Instead, they mark the cells for removal. Phagocytosis of the IgG antibody along with a component of the erythrocyte membrane creates sphere-shaped RBCs seen on peripheral smear.",
    educationalObjective: "Chronic lymphocytic leukemia (CLL) is associated with autoimmune hemolytic anemia (AIHA). Warm AIHA is mediated by IgG antibodies that cause extravascular hemolysis with spherocyte formation.",
  },
  {
    id: 8,
    stem: "A 28-year-old woman comes to the physician because of a 2-week history of fatigue and shortness of breath with exertion. She has no significant medical history. Physical examination shows pallor. Laboratory studies show hemoglobin of 8 g/dL, mean corpuscular volume of 72 fL, and serum ferritin of 8 ng/mL. Which of the following is the most likely diagnosis?",
    options: [
      { label: "A", text: "Anemia of chronic disease" },
      { label: "B", text: "Folate deficiency" },
      { label: "C", text: "Iron deficiency anemia" },
      { label: "D", text: "Sideroblastic anemia" },
      { label: "E", text: "Thalassemia trait" },
    ],
    correctAnswer: "C",
    explanation: "This patient has microcytic anemia (MCV 72 fL) with low serum ferritin (8 ng/mL), which is diagnostic of iron deficiency anemia. Low ferritin is the most specific indicator of depleted iron stores.\n\nIn reproductive-age women, menstrual blood loss is the most common cause of iron deficiency. Other causes include gastrointestinal blood loss, malabsorption, and inadequate dietary intake.\n\nLaboratory findings in iron deficiency include:\n• Low hemoglobin and hematocrit\n• Low MCV (microcytic)\n• Low serum iron\n• High TIBC (total iron-binding capacity)\n• Low serum ferritin\n• Low reticulocyte count",
    educationalObjective: "Iron deficiency anemia presents with microcytic anemia and low serum ferritin. In reproductive-age women, menstrual blood loss is the most common cause.",
  },
  {
    id: 9,
    stem: "A 55-year-old man with type 2 diabetes mellitus comes to the physician because of a 3-month history of progressive numbness and tingling in both feet. Physical examination shows decreased sensation to pinprick and vibration in a stocking distribution bilaterally. Which of the following is the most likely underlying mechanism of this patient's symptoms?",
    options: [
      { label: "A", text: "Accumulation of sorbitol in Schwann cells" },
      { label: "B", text: "Autoimmune destruction of myelin" },
      { label: "C", text: "Demyelination due to vitamin B12 deficiency" },
      { label: "D", text: "Ischemia from vasculitis" },
      { label: "E", text: "Mechanical compression of peripheral nerves" },
    ],
    correctAnswer: "A",
    explanation: "This patient has diabetic peripheral neuropathy, which typically presents as symmetric, distal sensory loss in a \"stocking-glove\" distribution. The underlying mechanism involves accumulation of sorbitol in Schwann cells.\n\nIn hyperglycemic states, excess glucose enters the polyol pathway where aldose reductase converts glucose to sorbitol. Sorbitol accumulates in tissues that do not require insulin for glucose uptake, including Schwann cells, lens, retina, and kidney.\n\nSorbitol accumulation causes:\n• Osmotic damage to cells\n• Decreased Na+/K+ ATPase activity\n• Decreased myoinositol\n• Impaired nerve conduction",
    educationalObjective: "Diabetic peripheral neuropathy results from accumulation of sorbitol in Schwann cells via the polyol pathway. This leads to osmotic damage and impaired nerve function, presenting as symmetric distal sensory loss.",
  },
  {
    id: 10,
    stem: "A 35-year-old woman comes to the physician because of palpitations and heat intolerance for 2 months. Physical examination shows a diffusely enlarged, nontender thyroid gland and bilateral exophthalmos. Laboratory studies show decreased TSH and increased free T4. Which of the following antibodies is most likely present in this patient?",
    options: [
      { label: "A", text: "Anti-thyroglobulin antibodies" },
      { label: "B", text: "Anti-thyroid peroxidase antibodies" },
      { label: "C", text: "TSH receptor-blocking antibodies" },
      { label: "D", text: "TSH receptor-stimulating antibodies" },
      { label: "E", text: "Anti-microsomal antibodies" },
    ],
    correctAnswer: "D",
    explanation: "This patient has Graves disease, characterized by the triad of hyperthyroidism, diffuse goiter, and ophthalmopathy (exophthalmos). The condition is caused by TSH receptor-stimulating antibodies (also called thyroid-stimulating immunoglobulin or TSI).\n\nThese IgG antibodies bind to and activate the TSH receptor, causing:\n• Increased thyroid hormone synthesis and release\n• Thyroid gland hyperplasia (diffuse goiter)\n• Suppressed TSH (negative feedback)\n\nThe ophthalmopathy in Graves disease results from TSH receptor expression on orbital fibroblasts and adipocytes, leading to inflammation and expansion of retroorbital tissues.",
    educationalObjective: "Graves disease is caused by TSH receptor-stimulating antibodies that activate the TSH receptor, leading to hyperthyroidism, diffuse goiter, and ophthalmopathy.",
  },
];

export const examInfo = {
  title: "NBME 26 Practice Exam",
  section: "Section 1",
  totalQuestions: 50,
  timeLimit: 60, // minutes
};
