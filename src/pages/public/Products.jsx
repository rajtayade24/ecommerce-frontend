import { useState, useMemo, useEffect, useRef } from 'react';
import { ProductCard } from '@/components/card/ProductCard';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { useProduct } from '@/hooks/useProduct';
import { getAllCategories } from '@/service/userService';
import { useSearchParams, } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") ?? null;

  const { searchQuery } = useAuthStore();

  const [selectedCategories, setSelectedCategories] = useState(initialCategory);
  const [organicOnly, setOrganicOnly] = useState(null);
  const [featureOnly, setFeatureOnly] = useState(null);
  const [sortMode, setSortMode] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10]);

  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategories) params.category = selectedCategories;
    if (organicOnly !== null) params.isOrganic = organicOnly ? "true" : "false";
    if (featureOnly !== null) params.isFeatured = featureOnly ? "true" : "false";
    if (sortMode) params.sort = sortMode;

    const sp = new URLSearchParams(params);
    setSearchParams(sp, { replace: true }); // replace avoids spamming history on each keystroke; change to false if you want back-button history per filter
  }, [searchQuery, selectedCategories, organicOnly, featureOnly, sortMode, setSearchParams]);

  const filterProduct = useMemo(() => ({ //useMemo makes the queryKey more stable and readable.
    search: searchQuery?.trim() || undefined,
    category: selectedCategories || undefined,
    isOrganic: organicOnly ? true : undefined,
    isFeatured: featureOnly ? true : undefined,
    sort: sortMode,
  }), [searchQuery, selectedCategories, organicOnly, featureOnly, sortMode]);

  const {
    products,
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProduct(filterProduct)

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

  const [allCategories, setAllCategories] = useState([])
  useEffect(() => {
    const fetchAllCategories = async () => {
      setAllCategories(await getAllCategories())
    }
    fetchAllCategories()
  }, [])

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-4">Categories</h3>
        <div className="space-y-3"  >
          {allCategories.map((category, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories === category.slug}
                onCheckedChange={(checked) => setSelectedCategories(checked ? category.slug : null)}
              />
              <Label htmlFor={category.id} className="text-sm capitalize cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="organic"
            checked={organicOnly}
            onCheckedChange={(checked) => setOrganicOnly(Boolean(checked))}
          />
          <Label htmlFor="organic" className="text-sm cursor-pointer">
            Organic Only
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="feature"
            checked={featureOnly}
            onCheckedChange={(checked) => setFeatureOnly(Boolean(checked))}
          />
          <Label htmlFor="feature" className="text-sm cursor-pointer">
            Feature Only
          </Label>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4">Price Range</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories(null);
          setOrganicOnly(false);
          setFeatureOnly(false);
          setPriceRange([0, 10]);
          setSortMode('new');
        }}
      >
        Clear Filters
      </Button>
    </div >
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Fresh Produce</h1>
          <p className="text-muted-foreground">
            Browse our complete selection of fresh vegetables and fruits
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex gap-4">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your product search</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">

          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Filters</h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">

            {isError ? <div>Error: {error?.message}</div>
              :
              (isLoading ? < div > Loading...</div>
                :
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {products.length} products
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

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
                </>
              )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default Products;
