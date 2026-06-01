// lib/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductData } from "@/types/product"; // <-- ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE!

export interface CartItem {
  product: ProductData;
  selectedColor: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // CORRECCIÓN: Se agrega '?' para que quantity sea opcional
  addToCart: (product: ProductData, color: string, quantity?: number) => void;
  removeFromCart: (productId: string | number, color: string) => void;
  updateQuantity: (productId: string | number, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // quantity por defecto es 1 si no se envía nada
      addToCart: (product, color, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id && item.selectedColor === color
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id && item.selectedColor === color
                // Sumamos la cantidad que el usuario eligió a la que ya estaba en el carrito
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { product, selectedColor: color, quantity }] });
        }
      },

      removeFromCart: (productId, color) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && item.selectedColor === color)
          ),
        });
      },

      updateQuantity: (productId, color, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.product.id === productId && item.selectedColor === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    }),
    {
      name: "epico-cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);