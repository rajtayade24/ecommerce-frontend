import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { getUsers, setUserActive } from "../service/adminService";

const PAGE_SIZE = 8;

export function useUser(filters = {}) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["users", filters],
    queryFn: ({ pageParam = 0 }) => getUsers(pageParam, PAGE_SIZE, filters),
    getNextPageParam: (lastPage) => {
      if (
        typeof lastPage?.number !== "number" ||
        typeof lastPage?.totalPages !== "number"
      ) {
        return undefined;
      }
      return lastPage.number < lastPage.totalPages - 1
        ? lastPage.number + 1
        : undefined;
    },
  });

  const users = useMemo(
    () => data?.pages.flatMap((p) => p.content) ?? [],
    [data]
  );

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }) => setUserActive(id, active),

    onMutate: async ({ id, active }) => {
      const queryKey = ["users", filters];
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old || !old.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            content: page.content.map((u) =>
              u.id === id
                ? { ...u, status: active ? "active" : "inactive" }
                : u
            ),
          })),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["users", filters], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", filters] });
    },
  });

  const toggleStatus = (user) => {
    const newActive = user.status !== "active";
    toggleActiveMutation.mutate({ id: user.id, active: newActive });
  };

  return {
    users,
    data,
    pages: data?.pages ?? [],
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    toggleStatus,
    toggleStatusState: toggleActiveMutation,
  };
}
