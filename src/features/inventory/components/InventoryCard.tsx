"use client";

import { Inventory } from "@/src/features/inventory/types/types";
import { Product } from "@/src/features/product/types/types";
import { Edit2, Trash2, Layers } from "lucide-react";

interface InventoryCardProps {
  inventory: Inventory;
  products: Product[];
  active: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function InventoryCard({
  inventory,
  products,
  active,
  onClick,
  onEdit,
  onDelete,
}: InventoryCardProps) {
  const productCount = products.filter(
    (p) => p.inventory_id === inventory.id,
  ).length;

  const totalStock = inventory.stock;
  return (
    <div
      onClick={onClick}
      className={`group relative w-full text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer
        ${
          active
            ? "border-violet-500/40 bg-violet-500/8 shadow-lg shadow-violet-500/10"
            : "border-white/[0.07] bg-overlay hover:border-white/15 hover:bg-white/[0.02]"
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
            ${active ? "bg-violet-500/20" : "bg-white/5"}`}
        >
          <Layers
            size={15}
            className={active ? "text-violet-400" : "text-white/30"}
          />
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/25 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
            title="Edit"
          >
            <Edit2 size={11} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <p
        className={`text-xs font-medium truncate mb-3 ${active ? "text-violet-200" : "text-white/70"}`}
      >
        {inventory.name ?? `Category #${inventory.id}`}
      </p>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-white/35 tabular-nums">
          {productCount} products
        </span>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-white/25">Stock</span>
          <span
            className={`text-[11px] font-medium tabular-nums ${
              totalStock === 0
                ? "text-red-400"
                : totalStock < 20
                  ? "text-amber-400"
                  : "text-emerald-400"
            }`}
          >
            {totalStock}
          </span>
        </div>
      </div>

      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-500 rounded-r-full" />
      )}
    </div>
  );
}
