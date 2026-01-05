// src/pages/admin/Users.jsx
import React, { useState, useEffect, useRef, useMemo, useId } from "react";
import { Eye, UserCheck, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";

const statusBadge = (active) =>
  active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

export default function Users() {
  const navigate = useNavigate()

  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState(query);
  const [active, setActive] = useState(null)

  const filters = useMemo(() => ({ //useMemo makes the queryKey more stable and readable.
    search: debounceQuery?.trim() || undefined,
    active: active !== null ? active : undefined
  }), [debounceQuery, active]);


  useEffect(() => {
    const id = setTimeout(() => setDebounceQuery(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  const {
    users,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    toggleStatus,
    toggleStatusState
  } = useUser(filters);

  function handleView(userId) {
    navigate(`${userId}`)
  }

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

  if (isError) {
    // axios error shapes: err.response?.data, err.message, etc.
    const errMessage =
      error?.response?.data?.message ||
      error?.message ||
      JSON.stringify(error);
    return <div className="text-red-600">Error: {errMessage}</div>;
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage your application users</p>
        </div>
      </div>


      {/* Filters */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <Input
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />

        {/* Active / Inactive / All Filter */}
        <Select
          value={active === null ? "all" : active ? "active" : "inactive"}
          onValueChange={(val) => setActive(val === "all" ? null : val === "active")}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button onClick={() => { setQuery(""); setActive(null); refetch(); }}>Reset</Button>
      </div>


      {/* Users table */}
      <Card className=" rounded-2xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-sm text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u.id ?? i} className="border-b last:border-b-0">
                  <td className="py-3 text-sm font-medium">{u.name}</td>
                  <td className="py-3 text-sm">{u.email}</td>
                  <td className="py-3 text-sm">
                    {u?.roles?.map((r, i) => <div key={i}>{r}</div>)}
                  </td>
                  <td className="py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(
                        u.active
                      )}`}
                    >
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(u.id)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={u.status === "active" ? "destructive" : "success"}
                        size="icon"
                        onClick={() => toggleStatus(u)}
                        title={u.status === "active" ? "Suspend" : "Activate"}
                        disabled={toggleStatusState.isLoading}
                      >
                        {u.status === "active" ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

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
    </div>
  );
}
