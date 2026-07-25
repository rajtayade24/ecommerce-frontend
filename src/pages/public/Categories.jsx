import { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import CategoryCard from '@/components/card/CategoryCard';
import { useCategory } from '@/hooks/useCategory';
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from '@/components/ui/Skeleton';

export function CategoryCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border overflow-hidden">
      <Skeleton className="aspect-video w-full" />

      <div className="p-4">
        <Skeleton className="h-6 w-28 mb-3" />

        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const [search, setSearch] = useState('');

  const {
    categories,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategory();

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c => (
      c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)
    ));
  }, [categories, search]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Browse categories and discover related products.</p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md"
          />

          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">Showing {filtered.length} categories</div>
            <Button variant="ghost" onClick={() => setSearch('')}>Clear</Button>
          </div>
        </div>

        <div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <CategoryCardSkeleton key={index} />
              ))
            }

            {isError && (
              <div className="py-4 text-center text-red-500 col-span-full">
                Error loading categories: {String(error.message ?? error)}
              </div>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <div className="py-4 text-center col-span-full">
                No categories found
              </div>
            )}

            <AnimatePresence initial={false}>
              {!isLoading && !isError &&
                filtered.map(cat => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
            </AnimatePresence>
          </motion.div>

          <div ref={loadMoreRef} style={{ padding: 20, textAlign: "center" }}>
            {isFetchingNextPage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CategoryCardSkeleton key={index} />
                ))}
              </div>
            )}

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
      </div>
    </div >
  );
}