import React, { useEffect, useState } from "react";
import ProductList from "../../components/producer/ProductList";
import ProductForm from "../../components/producer/ProductForm";
import "./ProducerProducts.css";
import {
  useProductProducerQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../hooks/query/useProductProducer";
import { showSuccessAlert, showConfirmDialog} from "../../utils/sweetAlert";
import OrdersTable from "../../components/producer/OrdersTable";

const ProducerProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSection, setActiveSection] = useState("products");

  const { isPending, error, data } = useProductProducerQuery();
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  const products = data || [];
  const loading = isPending;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = await showConfirmDialog("¿Deseas eliminar este producto?");
    
    if (confirmed) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        showSuccessAlert("Producto eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Editar producto existente
        console.log("Updating product:", productData, productData.id, editingProduct.id);
        await updateProductMutation.mutateAsync({
          productId: editingProduct.id,
          productData: productData
        });
        showSuccessAlert("Producto actualizado exitosamente");
      } else {
        // Crear nuevo producto
        await createProductMutation.mutateAsync(productData);
        showSuccessAlert("Producto creado exitosamente");
      }

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      // Aquí podrías mostrar un toast o mensaje de error al usuario
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginación simple
  const productsPerPage = 4;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const categories = [
    "vegetales",
    "frutas",
    "proteinas",
    "lacteos",
    "granos",
    "otros",
  ];

  useEffect(() => {
    if (activeSection !== "products") {
      setShowForm(false);
      setEditingProduct(null);
    }
  }, [activeSection]);

  const menuItems = [
    { id: "products", label: "Mis Productos" },
    { id: "orders", label: "Mis pedidos" },
  ];

  const renderProductsSection = () => (
    <div className="producer-products">
      <div className="producer-products__header">
        <h1 className="producer-products__title">Mis Productos</h1>
        <button
          className="producer-products__add-btn"
          onClick={handleAddProduct}
        >
          <span className="producer-products__add-icon">+</span>
          Agregar Producto
        </button>
      </div>

      <div className="producer-products__filters">
        <div className="producer-products__search">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="producer-products__search-input"
          />
        </div>

        <div className="producer-products__category">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="producer-products__category-select"
          >
            <option value="">Categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          className="producer-products__clear-btn"
          onClick={handleClearFilters}
        >
          Limpiar
        </button>
      </div>

      {error ? (
        <div className="producer-products__error">
          <div className="producer-products__error-content">
            <div className="producer-products__error-icon">⚠️</div>
            <h3>Error al cargar los productos</h3>
            <p>No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.</p>
          </div>
        </div>
      ) : (
        <ProductList
          products={paginatedProducts}
          loading={loading || createProductMutation.isPending}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {totalPages > 1 && (
        <div className="producer-products__pagination">
          <button
            className="producer-products__pagination-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`producer-products__pagination-btn ${
                currentPage === page
                  ? "producer-products__pagination-btn--active"
                  : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="producer-products__pagination-btn"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );

  return (
    <div className="producer-dashboard">
      <aside className="producer-dashboard__sidebar">
        <nav className="producer-dashboard__nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`producer-dashboard__nav-link ${
                activeSection === item.id
                  ? "producer-dashboard__nav-link--active"
                  : ""
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="producer-dashboard__content">
        {activeSection === "products" ? renderProductsSection() : <OrdersTable />}
      </main>
    </div>
  );
};

export default ProducerProducts;
