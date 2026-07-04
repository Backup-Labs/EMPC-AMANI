import { Search } from "lucide-react";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AdminSearchBar({ value, onChange, placeholder = "Search..." }: AdminSearchBarProps) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 pl-11 pr-4 w-full md:w-72 rounded-full border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
