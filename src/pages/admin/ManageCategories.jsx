import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCategory } from "@/hooks/useCategory";
import { Card } from "@/components/ui/Card";

export default function ManageCategories() {
  const {
    categories,
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    deleteCategoryMutation,
  } = useCategory();

  const [query, setQuery] = useState("");


  // filter categories by search query
  const filtered = categories.filter((c) =>
    `${c.name} ${c.id} ${c.description}`.toLowerCase().includes(query.toLowerCase())
  );

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
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    deleteCategoryMutation.mutate({ id });
  }

  function handleEdit(id) {
    // navigate to edit page
    window.location.href = `/admin/categories/${id}`;
  }
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Categories</h1>
          <p className="text-sm text-muted-foreground">Manage all product categories</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <Link to="/admin/categories/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <Card className=" rounded-2xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Description</th>
              <th className="py-2">Products</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-sm text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0">
                  <td className="py-3 text-sm font-medium">{c.id}</td>
                  <td className="py-3 text-sm">{c.name}</td>
                  <td className="py-3 text-sm">{c.description}</td>
                  <td className="py-3 text-sm">{c.count}</td>
                  <td className="py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(c.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div ref={loadMoreRef} style={{ padding: 20, textAlign: "center" }}>
          {isFetchingNextPage && <div className="p-4">Loading more products...</div>}

          {hasNextPage ? (
            <div className="p-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-4 px-4 py-2 bg-gray-200 rounded"
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </Button>
            </div>
          ) : (
            data && !isLoading && <div className="w-full h-1 bg-gray-700"></div>
          )}
        </div>
      </Card>
    </div>
  );
}
