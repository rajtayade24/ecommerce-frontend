import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/card/ProductCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopFeatureProducts } from "@/service/userService";
import { Skeleton } from "@/components/ui/Skeleton";

const ProductCardSkeleton = () => (
  <div className="rounded-xl border p-4 space-y-4">
    <Skeleton className="aspect-square w-full rounded-lg" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  </div>
);

export const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getTopFeatureProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-4 sm:py-8 lg:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Hand-picked fresh produce just for you
            </p>
          </div>

          <Link to="/products">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : (
            <AnimatePresence>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          )}
        </motion.div>

      </div>
    </section >
  );
};
