import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export function DebateScoreModal({
  isOpen,
  onClose,
  scores,
}: {
  isOpen: boolean;
  onClose: () => void;
  scores: {
    clarity: number;
    relevance: number;
    strength: number;
  };
}) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[700px] rounded-lg"
        onInteractOutside={onClose}
        onEscapeKeyDown={onClose}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Debate Round Ended
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Score Items */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Clarity</span>
            <span className="text-sm font-bold">{scores.clarity / 5}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Strength</span>
            <span className="text-sm font-bold">{scores.strength / 5}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Relevance</span>
            <span className="text-sm font-bold">{scores.relevance / 5}</span>
          </div>

          {/* Final Score */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Final Score</span>
              <span className="text-xl font-bold">
                {(scores.clarity + scores.relevance + scores.strength) / 15}
              </span>
            </div>
          </div>
        </div>
        <DialogClose asChild>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
