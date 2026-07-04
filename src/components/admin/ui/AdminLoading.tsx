import { AdminDashboardSkeleton, AdminTableSkeleton, ProductGridSkeleton } from "@/components/admin/ui/AdminSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

type AdminLoadingVariant = "table" | "dashboard" | "grid" | "form";

export function AdminLoading({
  label: _label,
  variant = "table",
}: {
  label?: string;
  variant?: AdminLoadingVariant;
}) {
  if (variant === "dashboard") return <AdminDashboardSkeleton />;
  if (variant === "grid") return <ProductGridSkeleton count={6} />;
  if (variant === "form") {
    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }
  return <AdminTableSkeleton />;
}
