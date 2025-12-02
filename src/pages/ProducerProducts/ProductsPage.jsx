import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductList from "../../components/producer/ProductList";
import ProductForm from "../../components/producer/ProductForm";
import InventoryForm from "../../components/producer/InventoryForm";
import "./ProducerProducts.css";
import {
  useProductProducerQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../hooks/query/useProductProducer";
import { showSuccessAlert, showConfirmDialog, showErrorAlert } from "../../utils/sweetAlert";
import { useCreateInventoryMutation } from "../../hooks/query/useCreateInventory";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);

  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [createdProductId, setCreatedProductId] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, error, data } = useProductProducerQuery();
  console.log("Productos del productor:", data);
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();
  const createInventoryMutation = useCreateInventoryMutation();

  const products = data || [];
  const loading = isPending;

  // Detectar parámetro de URL y abrir modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
      // Limpiar el parámetro de la URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setCreatedProductId(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = await showConfirmDialog(
      "¿Deseas eliminar este producto?",
      "Esta acción también eliminará su inventario asociado si existe."
    );

    if (confirmed) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        showSuccessAlert("Producto eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        showErrorAlert("No se pudo eliminar el producto");
      }
    }
  };

  const handleProductFormSubmit = async (productData) => {
    try {
      if (editingProduct) {
        // Modo edición: solo actualizar producto
        await updateProductMutation.mutateAsync({
          productId: editingProduct.id,
          productData: productData
        });
        showSuccessAlert("Producto actualizado exitosamente");
        setShowForm(false);
        setEditingProduct(null);
      } else {
        // Modo creación: crear producto y luego inventario
        const response = await createProductMutation.mutateAsync(productData);

        const newId = response.id || response.data?.id;

        if (newId) {
          setCreatedProductId(newId);
          setShowForm(false);
          setShowInventoryForm(true);
        } else {
          showErrorAlert("No se pudo crear el producto, intenta más tarde");
        }
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      showErrorAlert("Error al guardar el producto");
    }
  };

  const handleInventoryFormSubmit = async (inventoryData) => {
    console.log("Datos de inventario recibidos:", inventoryData);

    const payload = {
      productOfferId: inventoryData.productOfferId,
      available_quantity: inventoryData.quantity,
      unit: inventoryData.unit,
      minimum_threshold: inventoryData.minThreshold,
      maximum_capacity: inventoryData.maxCapacity
    };

    try {
      await createInventoryMutation.mutateAsync(payload);
      showSuccessAlert("¡Producto e inventario creados! Ya está listo para la venta.");
    } catch (error) {
      console.error("Error al crear inventario:", error);
      showErrorAlert("No se pudo crear el inventario");
    }

    setShowInventoryForm(false);
    setCreatedProductId(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCloseInventoryForm = (saved = false) => {

    if (saved === true) {
      setShowInventoryForm(false);
      setCreatedProductId(null);
      return; 
    }

    showConfirmDialog(
      "¿Cancelar configuración de inventario?",
      "El producto se creó pero no estará disponible para venta sin inventario."
    ).then((confirmed) => {
      if (confirmed) {
        setShowInventoryForm(false);
        setCreatedProductId(null);
      }
    });
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const productsPerPage = 4;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const categories = [
    "vegetales", "frutas", "proteinas", "lacteos", "granos", "otros",
  ];

  return (
    <div className="producer-products">
      <div className="producer-products__header">
        <h1 className="producer-products__title">Mis Productos</h1>
        <button
          className="producer-products__add-btn"
          onClick={handleAddProduct}
        >
          <span className="producer-products__add-icon">+</span>
          Crear Producto
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
              className={`producer-products__pagination-btn ${currentPage === page
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
          onSave={handleProductFormSubmit}
          onClose={handleCloseForm}
        />
      )}

      {showInventoryForm && (
        <InventoryForm
          productOfferId={createdProductId}
          onSave={handleInventoryFormSubmit}
          onClose={handleCloseInventoryForm}
        />
      )}
    </div>
  );
};

export default ProductsPage;