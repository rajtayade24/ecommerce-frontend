import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { ShoppingCart, Leaf, Star, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "@/components/ui/Sonner";
import { cardVariants } from "@/utils/motionVariants";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const [qty, setQty] = useState(0);

  // auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // only initialize cart if authenticated
  const cart = useCart({ enabled: isAuthenticated });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/cart", {
        state: { redirectTo: window.location.pathname },
      });
      return;
    }
    // logged in → call mutation
    cart.addToCartMutation.mutate({
      productId: product.id,
      variantId: product.variants[0].id,
      quantity: qty,
    });
    toast.success('Added to cart!', {
      description: `${product.name} - ${product.variants[0].value}${product.variants[0].unit}`
    });
    setQty(0);
  };
  if (!product) return null;
  return (
    <motion.div
      layout  //  MAGIC Now:, Size changes → animated,  Position changes → animated,   Reorder → animated,
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group"
    >
      <Card className=" rounded-2xl border overflow-hidden hover-lift h-full flex flex-col">
        {/* Image Container */}
        <Link
          to={`/products/${product.id}`}
          className="relative overflow-hidden bg-muted aspect-square"
        >
          <img
            src={product?.images?.[0] || productImages.tomatoes}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isOrganic && (
              <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                Organic
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-secondary text-secondary-foreground flex items-center gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          {product.inStock <= 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <Link to={`/products/${product.id}`}>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <div className="text-2xl font-bold text-primary">
                ₹{product?.variants[0]?.price?.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {product?.variants[0]?.value}
                {product?.variants[0]?.unit}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-primary text-white rounded-full px-[2px] py-0.5">
                {qty === 0 ? (
                  <button
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQty(1)}
                  >
                    <ShoppingCart className="h-4 w-4 p-0.5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setQty(qty === 1 ? 0 : qty - 1)}
                      className="px-1 text-xs"
                    >
                      −
                    </button>

                    <span className="text-xs font-semibold w-4 text-center">
                      {qty}
                    </span>

                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-1 text-xs"
                    >
                      +
                    </button>
                  </>
                )}
              </div>

              {qty !== 0 && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setQty(0)}
                    className="flex items-center justify-center bg-primary text-white rounded-full px-1.5 py-0.5 text-xs"
                  >
                    ×
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center bg-primary text-white rounded-full px-1.5 py-0.5"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
