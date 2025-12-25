import { Question } from "./examQuestions";

export const nbme25Questions: Question[] = [
  {
    id: 1,
    stem: "A 45-year-old woman comes to the physician because of a 3-month history of fatigue and weight gain of 4.5 kg (10 lb). She also notes constipation and dry skin. Physical examination shows a heart rate of 58/min and delayed relaxation of deep tendon reflexes. Laboratory studies are most likely to show which of the following?",
    options: [
      { label: "A", text: "Decreased TSH, decreased free T4" },
      { label: "B", text: "Decreased TSH, increased free T4" },
      { label: "C", text: "Increased TSH, decreased free T4" },
      { label: "D", text: "Increased TSH, increased free T4" },
      { label: "E", text: "Normal TSH, normal free T4" },
    ],
    correctAnswer: "C",
    explanation: "This patient presents with classic symptoms of hypothyroidism: fatigue, weight gain, constipation, dry skin, bradycardia, and delayed relaxation of deep tendon reflexes.\n\nIn primary hypothyroidism (the most common form), the thyroid gland fails to produce adequate thyroid hormone. This leads to:\n• Decreased free T4 (and T3)\n• Increased TSH due to loss of negative feedback\n\nThe pituitary releases more TSH in an attempt to stimulate the failing thyroid gland. Common causes include Hashimoto thyroiditis (autoimmune), iodine deficiency, and post-thyroidectomy or radioiodine ablation.",
    educationalObjective: "Primary hypothyroidism is characterized by elevated TSH and decreased free T4. The elevated TSH reflects the pituitary's attempt to stimulate an underactive thyroid gland.",
  },
  {
    id: 2,
    stem: "A 28-year-old man is brought to the emergency department after being found unconscious. His blood pressure is 80/50 mm Hg, pulse is 120/min, and respirations are 28/min. Physical examination shows pinpoint pupils and decreased bowel sounds. Track marks are noted on both arms. Which of the following is the most appropriate initial treatment?",
    options: [
      { label: "A", text: "Activated charcoal" },
      { label: "B", text: "Flumazenil" },
      { label: "C", text: "N-acetylcysteine" },
      { label: "D", text: "Naloxone" },
      { label: "E", text: "Physostigmine" },
    ],
    correctAnswer: "D",
    explanation: "This patient presents with the classic opioid toxidrome: altered mental status (unconscious), respiratory depression, hypotension, bradycardia (though this patient has compensatory tachycardia due to hypotension), pinpoint pupils (miosis), and decreased bowel sounds. The track marks suggest IV drug use.\n\nNaloxone is a competitive opioid receptor antagonist that rapidly reverses opioid effects. It should be given immediately in suspected opioid overdose, especially when respiratory depression is present.\n\nThe recommended initial dose is 0.4-2 mg IV, which can be repeated every 2-3 minutes as needed. Intranasal and intramuscular routes are also effective.",
    educationalObjective: "Opioid overdose presents with CNS depression, respiratory depression, and miosis. Naloxone is the antidote and should be administered immediately.",
  },
  {
    id: 3,
    stem: "A 55-year-old man with a history of alcohol use disorder comes to the physician because of abdominal distension and leg swelling for 2 weeks. Physical examination shows shifting dullness and a fluid wave. Laboratory studies show albumin of 2.5 g/dL. Diagnostic paracentesis shows a serum-ascites albumin gradient (SAAG) of 1.8 g/dL. Which of the following is the most likely cause of this patient's ascites?",
    options: [
      { label: "A", text: "Cirrhosis" },
      { label: "B", text: "Nephrotic syndrome" },
      { label: "C", text: "Peritoneal carcinomatosis" },
      { label: "D", text: "Spontaneous bacterial peritonitis" },
      { label: "E", text: "Tuberculous peritonitis" },
    ],
    correctAnswer: "A",
    explanation: "The serum-ascites albumin gradient (SAAG) is calculated by subtracting the ascites albumin from the serum albumin. A SAAG ≥1.1 g/dL indicates portal hypertension with 97% accuracy.\n\nThis patient has:\n• History of alcohol use disorder\n• SAAG of 1.8 g/dL (high, indicating portal hypertension)\n• Low serum albumin (2.5 g/dL)\n\nThese findings are consistent with cirrhosis, which causes portal hypertension leading to ascites. Cirrhosis is the most common cause of ascites in the Western world.\n\nA low SAAG (<1.1) suggests causes other than portal hypertension, such as peritoneal carcinomatosis, tuberculous peritonitis, or nephrotic syndrome.",
    educationalObjective: "A SAAG ≥1.1 g/dL indicates portal hypertension, most commonly caused by cirrhosis. A SAAG <1.1 g/dL suggests non-portal hypertensive causes.",
  },
  {
    id: 4,
    stem: "A 6-year-old boy is brought to the physician because of a 2-day history of fever and sore throat. Physical examination shows pharyngeal erythema and tonsillar exudates. A rapid streptococcal antigen test is positive. Treatment with penicillin is most likely to prevent which of the following complications?",
    options: [
      { label: "A", text: "Glomerulonephritis" },
      { label: "B", text: "Peritonsillar abscess" },
      { label: "C", text: "Reactive arthritis" },
      { label: "D", text: "Rheumatic fever" },
      { label: "E", text: "Scarlet fever" },
    ],
    correctAnswer: "D",
    explanation: "Group A Streptococcus (GAS) pharyngitis can lead to both suppurative and non-suppurative complications. Antibiotic treatment with penicillin (or amoxicillin) is primarily given to prevent acute rheumatic fever.\n\nRheumatic fever is an inflammatory condition that can affect the heart, joints, skin, and brain. It occurs 2-4 weeks after untreated GAS pharyngitis due to molecular mimicry between streptococcal M protein and cardiac myosin.\n\nImportantly, antibiotics do NOT prevent post-streptococcal glomerulonephritis, which is an immune complex-mediated disease that occurs regardless of treatment.\n\nAntibiotics do help prevent suppurative complications (peritonsillar abscess, retropharyngeal abscess) and reduce transmission.",
    educationalObjective: "The primary purpose of treating streptococcal pharyngitis with antibiotics is to prevent acute rheumatic fever. Antibiotics do not prevent post-streptococcal glomerulonephritis.",
  },
  {
    id: 5,
    stem: "A 32-year-old woman, gravida 1, para 0, at 28 weeks' gestation comes to the physician for a prenatal visit. She has no contractions or vaginal bleeding. Her blood pressure is 150/95 mm Hg; it was 118/72 mm Hg at her visit 4 weeks ago. Urinalysis shows 2+ protein. Which of the following is the most likely diagnosis?",
    options: [
      { label: "A", text: "Chronic hypertension" },
      { label: "B", text: "Eclampsia" },
      { label: "C", text: "Gestational hypertension" },
      { label: "D", text: "HELLP syndrome" },
      { label: "E", text: "Preeclampsia" },
    ],
    correctAnswer: "E",
    explanation: "Preeclampsia is defined as new-onset hypertension (≥140/90 mm Hg) after 20 weeks of gestation with proteinuria (≥300 mg/24 hours or protein/creatinine ratio ≥0.3, or dipstick ≥1+) OR with end-organ dysfunction.\n\nThis patient has:\n• New-onset hypertension (previously normotensive)\n• Onset after 20 weeks (28 weeks)\n• Proteinuria (2+ on dipstick)\n\nGestational hypertension is new-onset hypertension WITHOUT proteinuria or end-organ dysfunction. Chronic hypertension is hypertension present before 20 weeks or before pregnancy. Eclampsia requires seizures. HELLP syndrome includes hemolysis, elevated liver enzymes, and low platelets.",
    educationalObjective: "Preeclampsia is diagnosed by new-onset hypertension after 20 weeks of gestation with proteinuria or end-organ dysfunction. It is a leading cause of maternal and fetal morbidity.",
  },
];

export const nbme25Info = {
  title: "NBME 25 Practice Exam",
  section: "Section 1",
  totalQuestions: 50,
  timeLimit: 60,
};
