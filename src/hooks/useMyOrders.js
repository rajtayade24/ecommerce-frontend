// hooks/useOrders.js
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getOrders } from '../service/userService';
import { cancelOrder } from '@/service/userService';

const PAGE_SIZE = 10;

export const useMyOrders = () => {
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
    queryKey: ["orders"],
    queryFn: ({ pageParam = 0 }) => getOrders(pageParam, PAGE_SIZE),
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

  const orders = data?.pages.flatMap(p => p.content) ?? [];

  // const or
  // ders = React.useMemo(() => {
  // if (!data?.pages) return [];

  // const map = new Map();
  // data.pages.forEach(page => {
  //   page.content.forEach(order => {
  //     map.set(order.id, order);
  //   });
  // });

  // return Array.from(map.values());
// }, [data]);

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId) => cancelOrder(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previous = queryClient.getQueryData(['orders']);
      // optimistic update: mark order status CANCELLED locally
      queryClient.setQueryData(['orders'], old => {
        if (!old) return old;
        const newPages = old.pages.map(page => ({
          ...page,
          content: page.content.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o)
        }));
        return { ...old, pages: newPages };
      });
      return { previous };
    },
    onError: (_, __, context) => {
      toast.error('Failed to cancel order');
      if (context?.previous) {
        queryClient.setQueryData(['orders'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['orders']);
    },
    onSuccess: () => {
      toast.success('Order cancelled');
    }
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
    refetch,
    cancelOrderMutation,
  };
};

export default useMyOrders;
