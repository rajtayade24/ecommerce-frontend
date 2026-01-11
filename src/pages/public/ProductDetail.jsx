import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Leaf, ArrowLeft, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductById } from '@/service/userService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import useAuthStore from '@/store/useAuthStore';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/Sonner';

const ProductDetail = () => {
  const navigate = useNavigate()
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    const fetchProduct = async () => {
      try {
        const currentProduct = await getProductById(id);
        setProduct(currentProduct);
      } catch (err) { }
      finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id])

  const incrementQty = () => {
    if (quantity < product.variants[selectedWeight].stock) {
      setQuantity(prev => prev + 1);
    }
  };
  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  useEffect(() => {
    setQuantity(1);
  }, [selectedWeight]);

  // auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // only initialize cart if authenticated
  const cart = useCart({ enabled: isAuthenticated });


  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/carts", {
        state: { redirectTo: window.location.pathname },
      });
      return;
    }
    cart.addToCartMutation.mutate({
      productId: product.id,
      variantId: product.variants[selectedWeight].id,
      quantity
    });
    toast.success('Added to cart!', {
      description: `${product.name} - ${product.variants[selectedWeight].value}${product.variants[selectedWeight].unit}`
    });
  };

  const handleBuy = () => {
    const checkoutItems = [
      {
        productId: id,
        variantId: product.variants[selectedWeight].id,
        quantity,
      }
    ]

    navigate('/order/checkout', { state: { items: checkoutItems } });
  }

  if (isLoading) return (<div className='text-center'>Loading product...</div>)

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-4 sm:py-8 lg:py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container">
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />

            Back to Products
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-muted aspect-square">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isOrganic && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  Organic
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className='flex justify-between'>
              <div>
                <p className="text-sm text-muted-foreground capitalize mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {product.description}
                </p>
              </div>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Price */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <div className="text-4xl font-bold text-primary mb-2">
                ₹{product.variants[selectedWeight].price.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                per {product.variants[selectedWeight].value}{product.variants[selectedWeight].unit}
              </div>
            </div>

            {/* Weight Options */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Select Weight
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map((variant, index) => (
                  <Button
                    key={index}
                    variant={selectedWeight === index ? "default" : "outline"}
                    onClick={() => setSelectedWeight(index)}
                    className="h-auto py-3 flex flex-col"
                  >
                    <span className="font-bold">
                      {variant.value}{variant.unit}
                    </span>
                    <span className="text-xs mt-1">
                      ₹{variant.price.toFixed(2)}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={decrementQty}>-</Button>
                <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQty}>+</Button>
              </div>

              <Button
                size="lg"
                className="sm:flex-1 flex"
                onClick={handleAddToCart}
                disabled={product.variants[selectedWeight].stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.variants[selectedWeight].stock > 0
                  ? 'Add to Cart'
                  : 'Out of Stock'}
              </Button>

              <Button
                size="lg"
                className="sm:flex-1 flex"
                onClick={handleBuy}
                disabled={product.variants[selectedWeight].stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.variants[selectedWeight].stock > 0
                  ? 'Buy Now'
                  : 'Out of Stock'}
              </Button>
            </div>

            {/* Nutrition Info */}
            {product.nutrition && (
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Nutrition Facts</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories</span>
                    <span className="font-medium">{product.nutrition.calories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein</span>
                    <span className="font-medium">{product.nutrition.protein}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs</span>
                    <span className="font-medium">{product.nutrition.carbs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fiber</span>
                    <span className="font-medium">{product.nutrition.fiber}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Rich in:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.nutrition.vitamins.map((vitamin, index) => (
                        <Badge key={index} variant="secondary">
                          {vitamin}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

function Label({ children, className }) {
  return <label className={className}>{children}</label>;
}

export default ProductDetail;
