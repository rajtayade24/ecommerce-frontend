// src/components/UnAuthorizedUser.jsx
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const UnAuthorizedUser = ({ redirectTo = "/login", message }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center bg-card border rounded-2xl p-8 w-full max-w-md">
        <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {message ?? "Please sign in to view your cart"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          You need to be logged in to access shopping cart and checkout.
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(redirectTo)}>Sign in / Sign up</Button>

          <Link to="/products">
            <Button variant="ghost">Browse Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorizedUser;
