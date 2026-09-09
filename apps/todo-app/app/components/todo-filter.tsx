"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

export function TodoFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentFilter = searchParams.get("filter") || "all";

  const setFilter = (filter: string) => {
    startTransition(() => {
      router.push(`/?filter=${filter}`);
    });
  };

  return (
    <div className="flex items-end gap-1 absolute -top-8 right-6 h-8" role="group" aria-label="Todo filters">
      <FilterTab
        label="All"
        active={currentFilter === "all"}
        colorClass="bg-paper"
        onClick={() => setFilter("all")}
      />
      <FilterTab
        label="Active"
        active={currentFilter === "active"}
        colorClass="bg-sage"
        onClick={() => setFilter("active")}
      />
      <FilterTab
        label="Done"
        active={currentFilter === "completed"}
        colorClass="bg-lilac"
        onClick={() => setFilter("completed")}
      />
    </div>
  );
}

function FilterTab({
  label,
  active,
  colorClass,
  onClick,
}: {
  label: string;
  active: boolean;
  colorClass: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`focus-ring-custom rounded-t-lg px-4 pt-2 pb-1 font-sans font-semibold text-sm transition-all origin-bottom ${colorClass} ${
        active
          ? "h-8 text-ink border border-b-0 border-paper-line z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.02)] scale-y-100"
          : "h-7 text-ink-muted opacity-70 hover:opacity-100 border border-b-0 border-transparent z-10 scale-y-95 translate-y-1"
      }`}
    >
      {label}
    </button>
  );
}
