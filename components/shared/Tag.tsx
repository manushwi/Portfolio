import { cn } from "@/lib/utils";

type TagProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * Small monospace pill. Renders as a button when `onClick` is provided,
 * otherwise a plain span (used for skills + project tech tags).
 */
export function Tag({ children, active, onClick, className }: TagProps) {
  const cls = cn(
    "inline-flex items-center border px-2 py-0.5 text-xs transition-colors",
    onClick && "cursor-pointer select-none",
    active
      ? "border-accent text-accent"
      : "border-line text-muted hover:border-accent/60 hover:text-fg",
    className
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
      </button>
    );
  }
  return <span className={cls}>{children}</span>;
}
