import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { StopCircle } from "lucide-react";

interface EndBlockProps {
  answeredCount: number;
  totalQuestions: number;
  onEnd: () => void;
}

export const EndBlock = ({ answeredCount, totalQuestions, onEnd }: EndBlockProps) => {
  const unanswered = totalQuestions - answeredCount;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1.5">
          <StopCircle className="h-4 w-4" />
          <span className="hidden sm:inline">End Block</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Exam Block?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              You have answered <strong>{answeredCount}</strong> of{" "}
              <strong>{totalQuestions}</strong> questions.
            </p>
            {unanswered > 0 && (
              <p className="text-warning font-medium">
                ⚠️ You still have {unanswered} unanswered question
                {unanswered > 1 ? "s" : ""}.
              </p>
            )}
            <p>Are you sure you want to end this block and see your results?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue Exam</AlertDialogCancel>
          <AlertDialogAction onClick={onEnd} className="bg-destructive hover:bg-destructive/90">
            End Block
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
