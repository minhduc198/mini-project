"use client";

import { Inventory } from "@/src/features/inventory/types";
import { Product } from "@/src/features/product/types";
import { InventoryCard } from "./InventoryCard";
import { LayoutGrid, Plus } from "lucide-react";

interface Props {
  inventories: Inventory[];
  products: Product[];
  activeCategoryId: string | undefined;
  onSelect: (id: string | undefined) => void;
  onEdit: (inventory: Inventory) => void;
  onDelete: (ids: number[]) => void;
  onCreate: () => void;
}

export function InventoryGrid({
  inventories,
  products,
  activeCategoryId,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      <div
        onClick={() => onSelect(undefined)}
        className={`relative text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer
          ${
            !activeCategoryId
              ? "border-violet-500/40 bg-violet-500/8 shadow-lg shadow-violet-500/10"
              : "border-white/[0.07] bg-overlay hover:border-white/15 hover:bg-white/[0.02]"
          }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3
            ${!activeCategoryId ? "bg-violet-500/20" : "bg-white/5"}`}
        >
          <LayoutGrid
            size={15}
            className={!activeCategoryId ? "text-violet-400" : "text-white/30"}
          />
        </div>
        <p
          className={`text-xs font-medium mb-3 ${!activeCategoryId ? "text-violet-200" : "text-white/70"}`}
        >
          All Categories
        </p>
        <span className="text-[11px] text-white/35 tabular-nums">
          {products.length} products
        </span>
        {!activeCategoryId && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-500 rounded-r-full" />
        )}
      </div>

      {inventories.map((inv) => (
        <InventoryCard
          key={inv.id}
          inventory={inv}
          products={products}
          active={activeCategoryId === String(inv.id)}
          onClick={() => onSelect(String(inv.id))}
          onEdit={() => onEdit(inv)}
          onDelete={() => onDelete([inv.id])}
        />
      ))}

      <div
        onClick={onCreate}
        className="relative text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer
          border-dashed border-violet-500/30 bg-overlay
        hover:border-violet-500/60 hover:bg-violet-500/5"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-violet-500/10">
          <Plus size={16} className="text-violet-400" />
        </div>

        <p className="text-xs font-medium mb-3 text-violet-200">Create New</p>

        <span className="text-[11px] text-white/35">Add new category</span>

        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition bg-violet-500/5 blur-xl" />
      </div>
    </div>
  );
}
