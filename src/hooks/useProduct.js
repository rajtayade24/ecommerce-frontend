import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "@/service/userService";
import { deleteProduct, postProduct, updateProduct } from "@/service/adminService";

const PAGE_SIZE = 12;

export function useProduct(filter = {}) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["product", filter],
    queryFn: ({ pageParam = 0 }) => getProducts(pageParam, PAGE_SIZE, filter),
    keepPreviousData: false,
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

  const products = data?.pages.flatMap((p) => p.content) ?? [];

  const queryClient = useQueryClient();

  // ---- HELPER MOVED UP (Fix hoisting issue)
  const createdProductPage = (product) => ({
    content: [product],
    number: 0,
    size: PAGE_SIZE,
    totalPages: 1,
    last: true,
  });

  // -------------------- POST PRODUCT MUTATION --------------------
  const postProductMutation = useMutation({
    mutationFn: async ({ product, images }) => {
      return await postProduct(product, images);
    },

    onSuccess: (createdProduct) => {
      const queryKey = ["product"];

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) {
          return {
            pageParams: [],
            pages: [createdProductPage(createdProduct)],
          };
        }

        const newPages = [...old.pages];

        if (newPages.length === 0) {
          newPages[0] = {
            content: [createdProduct],
            number: 0,
            last: false,
          };
        } else {
          newPages[0] = {
            ...newPages[0],
            content: [createdProduct, ...(newPages[0].content || [])],
            totalElements:
              typeof newPages[0].totalElements === "number"
                ? newPages[0].totalElements + 1
                : undefined,
          };
        }

        return { ...old, pages: newPages };
      });
    },

    onError: (err) => {
      const message = err?.message || JSON.stringify(err) || "Upload failed";
      alert("Upload error: " + message);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product, images }) => {
      return await updateProduct(id, product, images);
    },

    onMutate: async ({ id, product }) => {
      const queryKey = ["product"];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update product in all pages
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            content: page.content?.map((p) =>
              p.id === id ? { ...p, ...product } : p
            ),
          })),
        };
      });

      return { previousData };
    },

    onError: (err, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["product"], context.previousData);
      }
      alert("Failed to update product");
    },

    onSuccess: (updatedProduct) => {
      // Ensure final server state is reflected
      queryClient.setQueryData(["product"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            content: page.content?.map((p) =>
              p.id === updatedProduct.id ? updatedProduct : p
            ),
          })),
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["product"]);
    },
  });

  // -------------------- DELETE PRODUCT MUTATION --------------------
  const deleteProductMutation = useMutation({
    mutationFn: async ({ id, token }) => await deleteProduct(id, token),

    onMutate: async ({ id }) => {
      const queryKey = ["product"];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        const newPages = old.pages.map((page) => {
          const content = page.content || [];
          const removed = content.some((p) => p.id === id);
          return {
            ...page,
            content: content.filter((p) => p.id !== id),
            totalElements:
              typeof page.totalElements === "number" && removed
                ? page.totalElements - 1
                : page.totalElements,
          };
        });

        return { ...old, pages: newPages };
      });

      return { previousData };
    },

    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["product"], context.previousData);
      }
      alert("Failed to delete product.");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["product"]);
    },
  });

  return {
    products,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    postProductMutation,
    updateProductMutation,
    deleteProductMutation,
    refetch: () => queryClient.invalidateQueries(["product"]),
  };
}
