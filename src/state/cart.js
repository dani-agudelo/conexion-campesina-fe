import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set) => ({
      items: [],
      
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productOfferId === product.id
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productOfferId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [
              ...state.items,
              {
                productOfferId: product.id,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  unit: product.unit,
                },
                quantity,
                price: product.price,
              },
            ],
          };
        });
      },
      
      updateQuantity: (productOfferId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productOfferId === productOfferId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },
      
      removeItem: (productOfferId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.productOfferId !== productOfferId
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'cart',
    }
  )
);

