import { Card } from "@/components/ui/card";

export default function OrderHeader({ 
  orderNumber, 
  productName, 
  productPrice, 
  productImage 
}) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground" data-testid="text-order-number">
            Order#: {orderNumber}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <img 
          src={productImage} 
          alt={productName}
          className="w-20 h-20 rounded-lg object-cover"
          data-testid="img-product"
        />
        <div className="flex-1">
          <h3 className="font-medium text-base" data-testid="text-product-name">{productName}</h3>
          <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-product-price">{productPrice}</p>
        </div>
      </div>
    </Card>
  );
}
