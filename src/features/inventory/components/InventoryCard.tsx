"use client";

import { Button } from "@/src/components/ui/button";
import { Inventory } from "@/src/features/inventory/types";
import { Product } from "@/src/features/product/types";
import { Edit2, Trash2, Layers } from "lucide-react";
import Image from "next/image";

interface Props {
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
}: Props) {
  const productCount = products.filter(
    (p) => p.inventory_id === inventory.id,
  ).length;

  const totalStock = inventory.stock;
  const hasImage = !!inventory.image;

  return (
    <div
      onClick={onClick}
      className={`group relative w-full text-left rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer
        ${
          active
            ? "border-violet-500/40 shadow-lg shadow-violet-500/10"
            : "border-white/[0.07] hover:border-white/15"
        }`}
    >
      {hasImage ? (
        <>
          <Image
            width={400}
            height={400}
            src={inventory.image!}
            alt={inventory.name ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          {active && <div className="absolute inset-0 bg-violet-500/15" />}
        </>
      ) : (
        <div
          className={`absolute inset-0 ${
            active ? "bg-violet-500/8" : "bg-overlay"
          }`}
        />
      )}

      <div className="relative p-4">
        <div className="flex items-start justify-between mb-8">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-sm
              ${active ? "bg-violet-500/30 border border-violet-500/30" : "bg-black/30 border border-white/10"}`}
          >
            <Layers
              size={15}
              className={active ? "text-violet-300" : "text-white/50"}
            />
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-6 h-6 rounded-md flex items-center justify-center text-white/50 hover:text-sky-400 hover:bg-sky-500/20 backdrop-blur-sm transition-colors min-h-6 p-0"
              title="Edit"
            >
              <Edit2 size={11} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-6 h-6 rounded-md flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/20 backdrop-blur-sm transition-colors min-h-6 p-0"
              title="Delete"
            >
              <Trash2 size={11} />
            </Button>
          </div>
        </div>

        <p
          className={`text-xs font-semibold truncate mb-2 drop-shadow-sm ${
            active ? "text-violet-200" : "text-white/90"
          }`}
        >
          {inventory.name ?? `Category #${inventory.id}`}
        </p>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-white/50 tabular-nums drop-shadow-sm">
            {productCount} products
          </span>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-white/40">Stock</span>
            <span
              className={`text-[11px] font-semibold tabular-nums drop-shadow-sm ${
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
      </div>

      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-400 rounded-r-full" />
      )}
    </div>
  );
}
