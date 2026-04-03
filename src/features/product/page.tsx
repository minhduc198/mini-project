"use client";

import { Button } from "@/src/components/ui/button";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { InventoryGrid } from "@/src/features/inventory/components/InventoryGrid";
import { InventoryModal } from "@/src/features/inventory/components/InventoryModal";
import { ProductModal } from "@/src/features/product/components/ProductModal";
import { ProductStats } from "@/src/features/product/components/ProductStats";
import { ProductTable } from "@/src/features/product/components/ProductTable";
import { GetProductListRequest, Product } from "@/src/features/product/types";
import { SORT } from "@/src/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { InventoryDeleteModal } from "../inventory/components/InventoryDeleteModal";
import { useInventories } from "../inventory/hook/useInventories";
import { Inventory } from "../inventory/types";
import { useProducts } from "./hook/useProducts";
import { queryClient } from "@/src/components/ReactQueryProvider";
import { productKeys } from "./query-key/product.query-key";

export default function Products() {
  const [productModal, setProductModal] = useState<
    | { open: false }
    | { open: true; mode: "add" }
    | { open: true; mode: "edit"; product: Product }
  >({ open: false });

  const [inventoryModal, setInventoryModal] = useState<
    | { open: false }
    | { open: true; mode: "add" }
    | { open: true; mode: "edit"; inventory: Inventory }
  >({ open: false });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    inventoryId: number[];
  }>({
    open: false,
    inventoryId: [],
  });

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
    updateProduct,
  } = useProducts(productListRq);

  const {
    inventoriesQuery,
    createInventory,
    updateInventory,
    deleteInventory,
  } = useInventories();

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

  const closeModal = () => setProductModal({ open: false });

  const closeInventoryModal = () => setInventoryModal({ open: false });

  const handleConfirmDelete = () => {
    deleteInventory.mutate(deleteModal.inventoryId);
    setDeleteModal({ open: false, inventoryId: [] });
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => setProductModal({ open: true, mode: "add" })}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 transition-colors text-xs font-medium shadow-lg shadow-violet-500/20 text-white h-auto"
          >
            <Plus size={13} />
            Add Product
          </Button>
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
            onCreate={() => setInventoryModal({ open: true, mode: "add" })}
            onEdit={(inv) =>
              setInventoryModal({
                open: true,
                mode: "edit",
                inventory: inv,
              })
            }
            onDelete={(ids) => {
              setDeleteModal({ open: true, inventoryId: ids });
            }}
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
          onEdit={(product) =>
            setProductModal({ open: true, mode: "edit", product })
          }
        />
      </div>

      {productModal.open && productModal.mode === "add" && (
        <ProductModal
          mode="add"
          open
          onClose={closeModal}
          onSubmit={createProduct}
          inventories={inventories}
          isSubmitting={isCreating}
        />
      )}

      {productModal.open && productModal.mode === "edit" && (
        <ProductModal
          mode="edit"
          open
          onClose={closeModal}
          onSubmit={(data) => updateProduct(data)}
          inventories={inventories}
          defaultValues={productModal.product}
          productId={productModal.product.id}
        />
      )}

      {inventoryModal.open && inventoryModal.mode === "add" && (
        <InventoryModal
          mode="add"
          open
          onClose={closeInventoryModal}
          onSubmit={createInventory.mutate}
          isSubmitting={createInventory.isPending}
        />
      )}

      {inventoryModal.open && inventoryModal.mode === "edit" && (
        <InventoryModal
          mode="edit"
          open
          onClose={closeInventoryModal}
          onSubmit={updateInventory.mutate}
          defaultValues={inventoryModal.inventory}
          inventoryId={inventoryModal.inventory.id}
          isSubmitting={updateInventory.isPending}
        />
      )}

      <InventoryDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, inventoryId: [] })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
