import React, { useEffect, useRef } from 'react';
import OrderCard from '@/components/card/OrderCard';
import { Button } from '@/components/ui/Button';
import useMyOrders from '@/hooks/useMyOrders';
import UnAuthorizedUser from '@/pages/public/UnAuthorizedUser';
import useAuthStore from '@/store/useAuthStore';

const MyOrders = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const {
    orders,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    cancelOrderMutation,
  } = useMyOrders({ enabled: isAuthenticated });


  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!loadMoreRef.current || !isAuthenticated) return;

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

  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-600">Error loading orders: {error?.message}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="p-8 text-center">You have no orders yet.</div>;
  }

  return (
    <div className="bg-background max-w-4xl mx-auto p-2 lg:p-4 space-y-4">
      <h1 className="text-2xl font-bold">Your Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard
            key={order.orderNumber}
            order={order}
            onCancel={(orderId) => cancelOrderMutation.mutate(orderId)}
            cancelling={cancelOrderMutation.isLoading}
          />
        ))}
      </div>

      <div ref={loadMoreRef} style={{ padding: 20, textAlign: "center" }}>
        {isFetchingNextPage && <div className="p-4">Loading more orders...</div>}

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
};

export default MyOrders;
