import { ShoppingCart, Shield, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function EmptyCart() {

const navigate = useNavigate();

const onContinueShopping = () => {
  navigate("/category/plants");
};

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex flex-col items-center text-center gap-8">
        <div className="w-64 h-64 relative rounded-lg overflow-hidden">
          {/* <img 
            src={emptyCartImage} 
            alt="Empty cart" 
            className="w-full h-full object-cover opacity-60"
          /> */}
        </div>
        
        <div className="space-y-4">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-semibold" data-testid="text-empty-cart-title">
            Oops! There are no items in your cart.
          </h2>
          <p className="text-muted-foreground">
            Start shopping to add items to your cart
          </p>
        </div>

        <Button 
          size="lg" 
          className="w-full max-w-md" 
          data-testid="button-continue-shopping"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          <Card className="border-primary/20">
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              <h3 className="font-semibold" data-testid="text-feature-safe">100% Safe</h3>
              <p className="text-sm text-muted-foreground text-center">
                Secure transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <Lock className="w-10 h-10 text-primary" />
              <h3 className="font-semibold" data-testid="text-feature-payment">Secure Payment</h3>
              <p className="text-sm text-muted-foreground text-center">
                Your data is protected
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <Star className="w-10 h-10 text-primary" />
              <h3 className="font-semibold" data-testid="text-feature-satisfaction">100% Satisfaction</h3>
              <p className="text-sm text-muted-foreground text-center">
                Guaranteed quality
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}