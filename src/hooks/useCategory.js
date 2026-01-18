import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/service/userService";
import { postCategory, deleteCategory } from "@/service/adminService";
import { toast } from "@/components/ui/Sonner";

const PAGE_SIZE = 4;

export function useCategory() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["category"],
    queryFn: ({ pageParam = 0 }) => getCategories(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => {
      if (typeof lastPage.number !== "number" || typeof lastPage.totalPages !== "number") {
        return undefined;
      }
      return lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined;
    },
  });

  const categories = data?.pages.flatMap((p) => p.content) ?? [];

  const queryClient = useQueryClient();

  const postCategoryMutation = useMutation({
    mutationFn: async ({ category, image }) => await postCategory(category, image),
    onMutate: async () => { },
    onSuccess: ({ data }) => {
      const createdCategory = data;
      const queryKey = ["category"];

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) {
          return {
            pageParams: [],
            pages: [{ ...createdCategoryPage(createdCategory) }],
          };
        }

        const newPages = [...old.pages];

        if (newPages.length === 0) {
          newPages[0] = {
            content: [createdCategory],
            number: 0,
            last: false,
          };
        } else {
          newPages[0] = {
            ...newPages[0],
            content: [createdCategory, ...(newPages[0].content || [])],
            totalElements:
              typeof newPages[0].totalElements === "number"
                ? newPages[0].totalElements + 1
                : undefined,
          };
        }

        return { ...old, pages: newPages };
      });
      toast.success(`Category "${createdCategory?.name}" created successfully! 🎉`);
    },
    onError: (err) => {
      // show user-friendly message
      const message = err?.message || JSON.stringify(err) || "Upload failed";
      toast.error(`Category creation failed: ${message}`);
    },
  });

  // Helper to create a minimal page object if cache empty (not required but keeps shape)
  const createdCategoryPage = (category) => ({
    content: [category],
    number: 0,
    size: 10,
    totalPages: 1,
    last: true,
  });


  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      return await deleteCategory(id);
    },

    onMutate: async ({ id }) => {
      const queryKey = ["category"];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        const newPages = old.pages
          .map((page) => {
            const content = page.content || [];
            const hadPost = content.some((p) => p.id === id);
            const newContent = content.filter((p) => p.id !== id);

            return {
              ...page,
              content: newContent,
              totalElements:
                typeof page.totalElements === "number"
                  ? hadPost
                    ? page.totalElements - 1
                    : page.totalElements
                  : page.totalElements,
            };
          })

        return { ...old, pages: newPages };
      });

      return { previousData };
    },

    onError: (error, _, context) => {
      const queryKey = ["category"];
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      const message = error?.message || "Delete failed";
      toast.error(`Failed to delete category: ${message}`);
    },

    onSuccess: (_, { id }) => {
      toast.success("Category deleted successfully!");
    },
    onSettled: () => {
      const queryKey = ["category"];
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    categories,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    deleteCategoryMutation,
    postCategoryMutation,
  };

}



