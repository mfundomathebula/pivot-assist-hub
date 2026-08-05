import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

export function AiDisclaimer({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span className="min-w-0">
        {compact
          ? "AI-generated content — review and verify before using it professionally."
          : "AI-generated content is provided for assistance purposes only. Please review, verify, and edit all generated content before using it professionally or making important decisions. AI responses may occasionally contain inaccuracies or incomplete information."}
      </span>
    </p>
  );
}
