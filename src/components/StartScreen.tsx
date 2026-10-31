import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, FileText, Play, Sparkles, ChevronDown } from "lucide-react";
import { ExamData } from "@/data/exams";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StartScreenProps {
  exams: ExamData[];
  selectedExam: ExamData;
  onSelectExam: (examId: string) => void;
  onStart: () => void;
  onPractice: () => void;
}

export const StartScreen = ({
  exams,
  selectedExam,
  onSelectExam,
  onStart,
  onPractice,
}: StartScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary via-primary to-secondary p-8 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-primary-foreground blur-2xl" />
              <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-primary-foreground blur-xl" />
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm mb-4"
            >
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            </motion.div>
            
            <h1 className="relative text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Medical Board Prep
            </h1>
            <p className="relative text-primary-foreground/80">
              Practice Examination
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Exam Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Exam
              </label>
              <Select value={selectedExam.id} onValueChange={onSelectExam}>
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Choose an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.title} - {exam.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-question-bg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{selectedExam.questions.length}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-question-bg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{selectedExam.timeLimit}</p>
                  <p className="text-sm text-muted-foreground">Minutes</p>
                </div>
              </motion.div>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 space-y-3"
            >
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Detailed explanations for each question</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Track your progress and performance</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Flag questions for review</span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Button
                onClick={onStart}
                size="lg"
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-lg h-12"
              >
                <Play className="h-5 w-5" />
                Start Timed Exam
              </Button>
              <Button
                variant="outline"
                onClick={onPractice}
                size="lg"
                className="w-full gap-2 text-lg h-12"
              >
                <BookOpen className="h-5 w-5" />
                Practice Mode
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="mt-4 text-center"><a href="/qbank" className="inline-flex rounded-lg border border-border bg-card px-5 py-3 font-medium text-foreground hover:bg-muted">Open imported Qbank</a></div>
        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Prepare confidently for your medical boards
        </motion.p>
      </motion.div>
    </div>
  );
};
