import { useState } from "react";

const useCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: "68fff29b77944465516e0949",
      productOfferId: "68fff29b77944465516e0949", 
      name: "Tomates Frescos",
      unit: "kg",
      price: 2500,
      quantity: 2,
      subtotal: 5000, 
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1726138647192-5275bef08970?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dG9tYXRlfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
    },
    {
      id: "68fe8469a61328860b802f00",
      productOfferId: "68fe8469a61328860b802f00",
      name: "Frijol Rojo Orgánico - Hacienda La Esperanza",
      unit: "unidad",
      price: 1800,
      quantity: 1,
      subtotal: 1800,
      imageUrl:
        "https://thumbs.dreamstime.com/b/una-impresionante-imagen-de-lechuga-verde-fresca-que-crece-en-cama-jard%C3%ADn-un-cierre-productos-caseros-sanos-alta-resoluci%C3%B3n-383804776.jpg",
    },
    {
      id: "69056af0fbc451669313e9e7",
      productOfferId: "69056af0fbc451669313e9e7",
      name: "Zanahorias Orgánicas",
      unit: "kg",
      price: 2000,
      quantity: 3,
      subtotal: 6000,
      imageUrl:
        "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=100",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId 
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity } 
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    console.log("Proceder al pago con:", cartItems);
    // Abrir el modal de dirección
    setIsAddressModalOpen(true);
  };

  const handleAddressSave = (addressData) => {
    console.log("Dirección guardada:", addressData);
    console.log("Creando orden con:", { cartItems, address: addressData });
    
    // Aquí puedes llamar a tu API para crear la orden
    // createOrder({ cartItems, address: addressData });
    
    // Cerrar el modal
    setIsAddressModalOpen(false);
    
    // Opcional: limpiar el carrito después de crear la orden
    // setCartItems([]);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleContinueShopping = () => {
    console.log("Seguir comprando");
    alert("Volver a la pestaña compras");
    // Aquí puedes agregar la navegación a la página de productos
  };


  return {
    cartItems,
    loading,
    isAddressModalOpen,
    handleUpdateQuantity,
    handleRemoveItem,
    handleCheckout,
    handleAddressSave,
    handleCloseAddressModal,
    handleContinueShopping,
  };
};

export default useCart;