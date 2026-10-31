import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/** A failed first load: the reason and a way to try again. */
export function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid justify-items-start gap-3">
      <Alert variant="error">{message || "Something went wrong. Please try again."}</Alert>
      <Button variant="outline" onClick={onRetry}>Try again</Button>
    </div>
  );
}
