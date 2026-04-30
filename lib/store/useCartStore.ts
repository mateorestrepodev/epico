// lib/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductData } from "@/components/3d/Modal3D";

export interface CartItem {
  product: ProductData;
  selectedColor: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Controla si el panel lateral está visible
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: ProductData, color: string) => void;
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

      addToCart: (product, color) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id && item.selectedColor === color
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id && item.selectedColor === color
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { product, selectedColor: color, quantity: 1 }] });
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
      // Excluimos 'isOpen' para que el carrito no aparezca abierto si el usuario recarga la página
      partialize: (state) => ({ items: state.items }),
    }
  )
);