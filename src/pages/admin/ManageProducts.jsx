// src/pages/admin/ManageProducts.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProduct } from "@/hooks/useProduct";
import { Card } from "@/components/ui/Card";
import { Dialog, DialogTrigger } from "../../components/ui/Dialog";
import DialogContentImpl from "../../components/DialogContentImpl";

export default function ManageProducts() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const {
    products,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    deleteProductMutation,
  } = useProduct();

  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleEdit = (product) => {
    navigate(`/admin/products/${product.id}`, { state: { product } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <Link to="/admin/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add product
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b">
              <th className="py-2">Name</th>
              <th className="py-2">SKU</th>
              <th className="py-2">Price</th>
              <th className="py-2">Stock</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>

          <tbody>

            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-red-500">
                  Error loading Products: {String(error)}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center">
                  No Product found
                </td>
              </tr>
            ) : (
              products?.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  handleEdit={handleEdit}
                  deleteProductMutation={deleteProductMutation}
                />
              ))
            )}

          </tbody>
        </table>

        {/* Load more */}
        <div ref={loadMoreRef} style={{ padding: 20, textAlign: "center" }}>
          {isFetchingNextPage && <div className="p-4">Loading more products...</div>}

          {hasNextPage ? (
            <div className="p-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-4 px-4 py-2 bg-gray-200 rounded"
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </button>
            </div>
          ) : (
            data && !isLoading && <div className="w-full h-1 bg-gray-700"></div>
          )}
        </div>
      </Card>
    </div>
  );
}

// --- Separate component for each row with its own dialog state ---
function ProductRow({ product, handleEdit, deleteProductMutation }) {
  const [open, setOpen] = useState(false);

  return (
    <tr className="border-b last:border-b-0">
      <td className="py-3 text-sm font-medium">{product?.name}</td>
      <td className="py-3 text-sm">{product?.slug ?? "—"}</td>
      <td className="py-3 text-sm">₹{product?.price}</td>
      <td className="py-3 text-sm">{product?.inStock ?? "—"}</td>
      <td className="py-3 text-sm">
        <div className="flex items-center gap-2">
          {/* Edit button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(product)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>

          {/* Delete dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>

            <DialogContentImpl
              title="Delete Confirmation"
              desc={`Do you want to delete ${product.name}?`}
              save="Delete"
              onSave={() =>
                product.id &&
                deleteProductMutation.mutate(product.id, {
                  onSuccess: () => setOpen(false),
                })
              }
            />
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
