import { Check, Copy, Download, Pencil, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/shared/ai-disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function OutputPanel({
  title,
  badge,
  value,
  onChange,
  loading,
  onRegenerate,
  downloadName = "lumen-output.txt",
  emptyState,
  className,
  monospace = false,
}: {
  title: string;
  badge?: string;
  value: string;
  onChange?: (next: string) => void;
  loading?: boolean;
  onRegenerate?: () => void;
  downloadName?: string;
  emptyState: React.ReactNode;
  className?: string;
  monospace?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't access the clipboard");
    }
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const hasContent = value.trim().length > 0;

  return (
    <section className={cn("panel flex min-h-[24rem] flex-col overflow-hidden", className)}>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {badge && (
            <Badge variant="secondary" className="shrink-0 rounded-full text-[11px]">
              {badge}
            </Badge>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ActionButton label="Copy" onClick={copy} disabled={!hasContent}>
            {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          </ActionButton>
          {onChange && (
            <ActionButton
              label={editing ? "Save edits" : "Edit"}
              disabled={!hasContent}
              onClick={() => {
                if (editing) {
                  onChange(draft);
                  toast.success("Changes saved");
                }
                setEditing((prev) => !prev);
              }}
            >
              {editing ? <Save className="size-4" /> : <Pencil className="size-4" />}
            </ActionButton>
          )}
          <ActionButton label="Download" onClick={download} disabled={!hasContent}>
            <Download className="size-4" />
          </ActionButton>
          {onRegenerate && (
            <ActionButton label="Regenerate" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            </ActionButton>
          )}
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-5">
        {loading ? (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : hasContent ? (
          editing ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[18rem] resize-none rounded-xl font-[inherit] text-sm leading-relaxed"
              aria-label={`Edit ${title}`}
            />
          ) : (
            <div
              className={cn(
                "surface-soft animate-fade-in whitespace-pre-wrap p-4 text-sm leading-relaxed",
                monospace && "font-mono text-[13px]",
              )}
            >
              {value}
            </div>
          )
        ) : (
          <div className="flex h-full min-h-[16rem] items-center justify-center">{emptyState}</div>
        )}
      </div>

      {hasContent && !loading && (
        <footer className="border-t border-border px-4 py-3 sm:px-5">
          <AiDisclaimer compact />
        </footer>
      )}
    </section>
  );
}

function ActionButton({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="rounded-lg" aria-label={label} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
