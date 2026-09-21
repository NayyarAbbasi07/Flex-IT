export type CartItem = {
  /** Unique line key: `${productId}:${size}` */
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  sku?: string;
  size: string;
  price: number;
  condition?: string;
  image?: string;
  quantity: number;
};

export type AddToCartInput = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number;
};

export const CART_STORAGE_KEY = "flexit-cart";

export function cartLineId(productId: string, size: string) {
  return `${productId}:${size}`;
}

export function calcCartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function calcCartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
