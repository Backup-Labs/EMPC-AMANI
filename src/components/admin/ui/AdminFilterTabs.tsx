interface AdminFilterTabsProps {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}

export function AdminFilterTabs({ tabs, active, onChange }: AdminFilterTabsProps) {
  return (
    <div className="flex bg-muted rounded-full p-1 border border-border flex-wrap gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
            active === tab.id ? "bg-primary text-background shadow-sm" : "text-foreground/55 hover:text-foreground"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 opacity-70">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
