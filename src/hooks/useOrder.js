import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { cancelOrder, getAllOrders, markOrderComplete } from "@/service/adminService";

const PAGE_SIZE = 8;

export function useOrder(filter = {}) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["order", filter],
    queryFn: ({ pageParam = 0 }) => getAllOrders(pageParam, PAGE_SIZE, filter),
    getNextPageParam: (lastPage) => {
      if (typeof lastPage.number !== "number" || typeof lastPage.totalPages !== "number") {
        return undefined;
      }
      return lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined;
    },
  });

  const orders = data?.pages.flatMap((p) => p.content) ?? [];

  const queryClient = useQueryClient();
  /* =========================
    HELPER: UPDATE ORDER STATUS IN CACHE
    ========================= */
  const updateOrderStatusInCache = (orderNumber, newStatus) => {
    queryClient.setQueryData(["order", filter], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          content: page.content.map((o) =>
            o.orderNumber === orderNumber
              ? { ...o, status: newStatus }
              : o
          ),
        })),
      };
    });
  };

  /* =========================
     MARK COMPLETE MUTATION
     ========================= */
  const markCompleteOrderMutation = useMutation({
    mutationFn: (orderNumber) => markOrderComplete(orderNumber),

    onMutate: async (orderNumber) => {
      await queryClient.cancelQueries({ queryKey: ["order", filter] });

      // optimistic update
      updateOrderStatusInCache(orderNumber, "COMPLETED");

      return { orderNumber };
    },

    onError: (err, orderNumber, context) => {
      // rollback
      queryClient.invalidateQueries({ queryKey: ["order", filter] });
      console.error("Failed to mark complete:", err);
    },

    onSuccess: (updatedOrder) => {
      // ensure backend truth
      updateOrderStatusInCache(updatedOrder.orderNumber, updatedOrder.status);
    },
  });

  /* =========================
     CANCEL ORDER MUTATION
     ========================= */
  const cancelOrderMutation = useMutation({
    mutationFn: (orderNumber) => cancelOrder(orderNumber),

    onMutate: async (orderNumber) => {
      await queryClient.cancelQueries({ queryKey: ["order", filter] });

      // optimistic update
      updateOrderStatusInCache(orderNumber, "CANCELLED");

      return { orderNumber };
    },

    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: ["order", filter] });
      console.error("Failed to cancel order:", err);
    },

    onSuccess: (updatedOrder) => {
      updateOrderStatusInCache(updatedOrder.orderNumber, updatedOrder.status);
    },
  });

  return {
    orders,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    markCompleteOrderMutation,
    cancelOrderMutation,
  };

}



