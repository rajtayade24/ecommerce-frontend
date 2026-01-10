
import { useInfiniteQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { addToCart, getCarts, removeFromCart, updateCartQuantity, clearCart } from "@/service/userService";
import { toast } from "@/components/ui/Sonner";

const PAGE_SIZE = 10;
export const useCart = ({ enabled = true } = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["cart"],
    queryFn: ({ pageParam = 0 }) => getCarts(pageParam, PAGE_SIZE),
    enabled, // ⭐ IMPORTANT FIX ⭐
    getNextPageParam: (lastPage) => {
      if (
        typeof lastPage.number !== "number" ||
        typeof lastPage.totalPages !== "number"
      ) {
        return undefined;
      }
      return lastPage.number < lastPage.totalPages - 1
        ? lastPage.number + 1
        : undefined;
    },
  });

  const items = data?.pages.flatMap((p) => p.content) ?? [];

  // ---- HELPER MOVED UP (Fix hoisting issue)
  const createdCartPage = (cartItem) => ({
    content: [cartItem],
    number: 0,
    size: PAGE_SIZE,
    totalPages: 1,
    last: true,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, variantId, quantity = 1 }) =>
      await addToCart({ productId, variantId, quantity }),

    onSuccess: (createdCart) => {
      const queryKey = ["cart"];

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) {
          return {
            pageParams: [],
            pages: [createdCartPage(createdCart)],
          };
        }

        const newPages = [...old.pages];

        if (newPages.length === 0) {
          newPages[0] = {
            content: [createdCart],
            number: 0,
            last: false,
          };
        } else {
          newPages[0] = {
            ...newPages[0],
            content: [createdCart, ...(newPages[0].content || [])],
            totalElements:
              typeof newPages[0].totalElements === "number"
                ? newPages[0].totalElements + 1
                : undefined,
          };
        }

        return { ...old, pages: newPages };
      });
      toast.success("Item added to cart!");
    },

    onError: (err) => {
      const message = err?.message || JSON.stringify(err) || "Upload failed";
      toast.error(`Failed to add item: ${message}`);
    },
  });

  // -------------------- DELETE PRODUCT MUTATION --------------------
  const removeCartMutation = useMutation({
    mutationFn: async ({ id }) => await removeFromCart(id),

    onMutate: async ({ id }) => {
      const queryKey = ["cart"];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      // Optimistic UI
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        const newPages = old.pages.map((page) => {
          const content = page.content || [];
          const exists = content.some((item) => item.id === id);
          return {
            ...page,
            content: content.filter((item) => item.id !== id),
            totalElements:
              typeof page.totalElements === "number" && exists
                ? page.totalElements - 1
                : page.totalElements,
          };
        });

        return { ...old, pages: newPages };
      });
      return { previousData };
    },

    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["cart"], context.previousData);
      }
      toast.error("Failed to delete item from cart");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.info("Cart updated");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }) => updateCartQuantity(id, quantity),

    onMutate: async ({ id, quantity }) => {
      const queryKey = ["cart"];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        const newPages = old.pages.map((page) => ({
          ...page,
          content: page.content.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));

        return { ...old, pages: newPages };
      });
      toast.success("Quantity updated");
      return { previousData };
    },

    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["cart"], context.previousData);
      }
      toast.error("Failed to update quantity ⚠️");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => clearCart(),

    onMutate: async () => {
      const queryKey = ["cart"];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, {
        pageParams: [],
        pages: [],
      });

      toast.success("Cart cleared");
      return { previousData };
    },

    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["cart"], context.previousData);
      }
      toast.error("Failed to clear cart");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  return {
    items,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    addToCartMutation,
    removeCartMutation,
    updateQuantityMutation,
    clearCartMutation,

    refetch: () => queryClient.invalidateQueries(["cart"]),
  };
}

export default useCart;