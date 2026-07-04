export function AdminLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      <span className="font-bold text-[10px] uppercase tracking-widest text-foreground/40">{label}</span>
    </div>
  );
}
