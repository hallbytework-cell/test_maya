import { ShoppingBag, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 sm:px-3 py-2 rounded-md cursor-pointer" data-testid="link-home">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <span className="text-lg sm:text-xl font-semibold text-primary">Maya Vriksh</span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Link href="/" className="hover-elevate active-elevate-2 px-1 sm:px-2 py-1 rounded-md hidden sm:inline" data-testid="link-breadcrumb-home">
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
            <Link href="/cart" className="hover-elevate active-elevate-2 px-1 sm:px-2 py-1 rounded-md hidden sm:inline" data-testid="link-breadcrumb-cart">
              <span>Cart</span>
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
            <span className="text-foreground font-medium px-1 sm:px-2 py-1" data-testid="text-breadcrumb-current">Checkout</span>
          </nav>
        </div>
      </div>
    </header>
  );
}