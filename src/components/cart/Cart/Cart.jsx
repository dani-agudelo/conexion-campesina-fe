import useCart from "../../../hooks/useCart";
import CartSummary from "../CartSummary";
import AddressModal from "../AddressModal/AddressModal";

const Cart = () => {
  const {
    cartItems,
    loading,
    isAddressModalOpen,
    handleUpdateQuantity,
    handleRemoveItem,
    handleCheckout,
    handleAddressSave,
    handleCloseAddressModal,
    handleContinueShopping,
  } = useCart();

  return (
    <>
      <CartSummary
        cartItems={cartItems}
        loading={loading}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
        onCheckout={handleCheckout}
        onContinueShopping={handleContinueShopping}
      />
      
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        onSave={handleAddressSave}
      />
    </>
  );
};

export default Cart;