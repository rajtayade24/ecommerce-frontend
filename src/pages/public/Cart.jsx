import { useNavigate, Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import UnAuthorizedUser from "@/pages/public/UnAuthorizedUser";
import useAuthStore from "@/store/useAuthStore";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }

  const { items, removeCartMutation, updateQuantityMutation } = useCart();

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, i) => sum + i.variant.price * i.quantity,
      0
    );
    const delivery = subtotal < 200 ? 40 : 0;
    return { subtotal, delivery, total: subtotal + delivery };
  }, [items]);

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    updateQuantityMutation.mutate({
      id: item.id,
      quantity: newQty,
    });
  };

  const handleCheckout = () => {
    const checkoutItems = items.map((item) => ({
      productId: item.product.id,
      variantId: item.variant.id,
      quantity: item.quantity,
    }));

    navigate("/checkout", { state: { items: checkoutItems } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <Link to="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-2xl p-4 flex gap-4"
            >
              <Link
                to={`/products/${item.product.id}`}
                className="w-24 h-24 rounded-xl overflow-hidden"
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1">
                <div className="flex justify-between">
                  <Link to={`/products/${item.product.id}`}>
                    <h3 className="font-bold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.variant.value}
                      {item.variant.unit}
                    </p>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeCartMutation.mutate({ id: item.id })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={item.quantity === 1}
                      onClick={() => handleQuantityChange(item, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleQuantityChange(item, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-lg font-bold">
                    ₹{(item.variant.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="sticky top-24 bg-card border rounded-2xl p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{totals.delivery.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </div>

          <Input placeholder="Enter coupon code" className="mb-3" />

          <Button size="lg" className="w-full" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>

          <Link to="/products">
            <Button variant="ghost" className="w-full mt-3">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
