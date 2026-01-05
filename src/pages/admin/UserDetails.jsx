
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getUserById, setUserActive } from "../../service/adminService";
import { Eye } from "lucide-react";
import { Card } from "../../components/ui/Card";

function statusBadge(active) {
  return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
}

export default function UserDetails() {
  const { id } = useParams(); // route should be like /admin/users/:id
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // fetch user
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 1000 * 30, // 30s
  });

  // mutation to toggle active
  const toggleActiveMutation = useMutation({
    mutationFn: ({ userId, active }) => setUserActive(userId, active),

    onMutate: async ({ userId, active }) => {
      // Cancel queries for user + users list
      await queryClient.cancelQueries({ queryKey: ["user", id] });
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot previous data
      const previousUser = queryClient.getQueryData(["user", id]);

      // Optimistically update user detail
      queryClient.setQueryData(["user", id], (old) => {
        if (!old) return old;
        return { ...old, active };
      });

      // Optionally update users list cache (if present)
      const prevUsers = queryClient.getQueryData(["users"]);
      if (prevUsers?.pages) {
        queryClient.setQueryData(["users"], (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content.map((u) =>
                u.id === userId ? { ...u, active } : u
              ),
            })),
          };
        });
      }

      return { previousUser, prevUsers };
    },

    onError: (err, variables, context) => {
      // rollback
      if (context?.previousUser) {
        queryClient.setQueryData(["user", id], context.previousUser);
      }
      if (context?.prevUsers) {
        queryClient.setQueryData(["users"], context.prevUsers);
      }
      alert(err?.message || "Failed to update user status");
    },

    onSettled: () => {
      // re-sync
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleToggleActive = () => {
    if (!user) return;
    const wantActive = !user.active;

    // confirmation for admin-critical actions
    if (!wantActive) {
      const ok = window.confirm(
        "Are you sure you want to deactivate this user? This will immediately revoke access."
      );
      if (!ok) return;
    }

    toggleActiveMutation.mutate({ userId: user.id, active: wantActive });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-lg font-medium">Loading user...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="text-red-600">Error loading user: {String(error)}</div>
        <Button onClick={() => navigate(-1)} className="mt-4">Back</Button>
      </div>
    );
  }

  // render details
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>

          <Button
            variant={user?.active ? "destructive" : "success"}
            onClick={handleToggleActive}
            disabled={toggleActiveMutation.isLoading}
            title={user.active ? "Deactivate user" : "Activate user"}
          >
            {user.active ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className=" p-4 rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Status</div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(user.active)}`}>
              {user.active ? "Active" : "Inactive"}
            </span>
          </div>
        </Card>

        <Card className=" p-4 rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Roles</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(user.roles || []).map((r) => (
              <span key={r} className="px-2 py-1 rounded bg-slate-100 text-xs">{r}</span>
            ))}
          </div>
        </Card>

        <Card className=" p-4 rounded shadow-sm col-span-2">
          <div className="text-xs text-muted-foreground">Metadata</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">ID</div>
              <div>{user.id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Joined</div>
              <div>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last updated</div>
              <div>{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Email verified</div>
              <div>{user.email !== null && user.email !== "" ? "Yes" : "No"}</div>
            </div>
          </div>
        </Card>

        {/* Address block if available */}
        {user.shippingAddress && (
          <Card className=" p-4 rounded shadow-sm col-span-2">
            <div className="text-xs text-muted-foreground">Shipping address</div>
            <div className="mt-2 text-sm space-y-1">
              <div>{user.shippingAddress.address}</div>
              <div>{user.shippingAddress.city}, {user.shippingAddress.state}</div>
              <div>{user.shippingAddress.postcode}</div>
              <div>{user.shippingAddress.country}</div>
            </div>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>Close</Button>
      </div>
    </div>
  );
}