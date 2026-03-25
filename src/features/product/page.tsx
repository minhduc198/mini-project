"use client";

import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { InventoryGrid } from "@/src/features/inventory/components/InventoryGrid";
import { AddProductModal } from "@/src/features/product/components/AddProductModal";
import { ProductStats } from "@/src/features/product/components/ProductStats";
import { ProductTable } from "@/src/features/product/components/ProductTable";
import { GetProductListRequest } from "@/src/features/product/types/types";
import { SORT } from "@/src/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useInventories } from "../inventory/hook/useInventories";
import { useProducts } from "./hook/useProducts";

export default function Products() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(
    undefined,
  );
  const [productListRq, setProductListRq] = useState<GetProductListRequest>({
    filter: {},
    sort: { field: "reference", order: SORT.DESC },
    pagination: { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE },
  });

  const {
    statsQueryProduct,
    listQueryProduct,
    createProduct,
    isCreating,
    deleteProducts,
  } = useProducts(productListRq);
  const { inventoriesQuery } = useInventories();

  const allProducts = statsQueryProduct.data?.data ?? [];
  const pageProducts = listQueryProduct.data?.data ?? [];
  const totalFiltered = listQueryProduct.data?.total ?? 0;
  const inventories = inventoriesQuery.data?.data ?? [];

  const handleSelectCategory = (id: string | undefined) => {
    setActiveCategoryId(id);
    setProductListRq((prev) => ({
      ...prev,
      filter: { ...prev.filter, inventory_id: id },
      pagination: { ...prev.pagination, page: DEFAULT_PAGE },
    }));
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="p-6 space-y-5 mx-auto w-full min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Products</h1>
            <p className="text-xs text-white/30 mt-0.5">
              {allProducts.length} total products
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 transition-colors text-xs font-medium shadow-lg shadow-violet-500/20"
          >
            <Plus size={13} />
            Add Product
          </button>
        </div>

        <ProductStats products={allProducts} inventories={inventories} />

        <div>
          <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3">
            Categories
          </p>
          <InventoryGrid
            inventories={inventories}
            products={allProducts}
            activeCategoryId={activeCategoryId}
            onSelect={handleSelectCategory}
            onEdit={(inv) => console.log("Edit inventory:", inv)}
            onDelete={(inv) => console.log("Delete inventory:", inv)}
          />
        </div>

        <ProductTable
          products={pageProducts}
          total={totalFiltered}
          isLoading={listQueryProduct.isLoading}
          inventories={inventories}
          request={productListRq}
          onRequestChange={setProductListRq}
          onDelete={deleteProducts}
        />
      </div>

      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={createProduct}
        inventories={inventories}
        isSubmitting={isCreating}
      />
    </div>
  );
}
