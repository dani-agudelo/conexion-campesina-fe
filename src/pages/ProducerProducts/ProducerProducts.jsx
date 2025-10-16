import React, { useState, useEffect } from 'react';
import ProductList from '../../components/producer/ProductList';
import ProductForm from '../../components/producer/ProductForm';
import './ProducerProducts.css';

const ProducerProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock data - luego viene del backend
  const mockProducts = [
    {
      id: 1,
      name: 'Tomates orgánicos',
      description: 'Tomates orgánicos cultivados en la finca, libres de pesticidas y químicos',
      price: 2500,
      quantity: 50,
      unit: 'kg',   
      imageUrl: 'https://plus.unsplash.com/premium_photo-1726138647192-5275bef08970?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dG9tYXRlfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
      category: 'vegetales'
    },
    {
      id: 2,
      name: 'Lechuga fresca',
      description: 'Lechuga fresca de hoja verde, crujiente y perfecta para ensaladas',
      price: 1800,
      quantity: 30,
      unit: 'unidad',
      imageUrl: 'https://thumbs.dreamstime.com/b/una-impresionante-imagen-de-lechuga-verde-fresca-que-crece-en-cama-jard%C3%ADn-un-cierre-productos-caseros-sanos-alta-resoluci%C3%B3n-383804776.jpg',
      category: 'vegetales'
    },
    {
      id: 3,
      name: 'Huevos de granja',
      description: 'Huevos de gallinas criadas en libertad, con yemas de color intenso',
      price: 3000,
      quantity: 20,
      unit: 'docena',
      imageUrl: 'https://img.freepik.com/foto-gratis/ingrediente-cocinar-platos-huevos-vista-superior_185193-108925.jpg?semt=ais_hybrid&w=740&q=80',
      category: 'proteinas'
    },
    {
      id: 4,
      name: 'Miel pura',
      description: 'Miel pura de abejas de la región, sin procesar y llena de nutrientes naturales',
      price: 8000,
      quantity: 15,
      unit: 'frasco',
      imageUrl: 'https://media.istockphoto.com/id/598241944/es/foto/miel-en-tarro-y-racimo-de-lavanda-seca.jpg?s=612x612&w=0&k=20&c=v191EGMnHjsgkcx0LK7kUA-qfy81wiKSSag0k8Ch9aQ=',
      category: 'otros'
    },
    {
      id: 5,
      name: 'Queso artesanal',
      description: 'Queso artesanal de leche de vaca, con un sabor único y textura cremosa',
      price: 12000,
      quantity: 10,
      unit: 'kg',
      imageUrl: 'https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/9ae9a782-75f5-5a51-8f9d-c0f0690b0579/8d6dd3bf-6565-5da9-ab34-943d5f798af6.jpg',
      category: 'lacteos'
    },
    {
      id: 6,
      name: 'Plátanos maduros',
      description: 'Plátanos maduros y dulces, perfectos para postres y batidos naturales',
      price: 1500,
      quantity: 25,
      unit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100',
      category: 'frutas'
    },
    {
      id: 7,
      name: 'Zanahorias frescas',
      description: 'Zanahorias frescas y crujientes, ricas en vitaminas y perfectas para ensaladas',
      price: 2000,
      quantity: 40,
      unit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=100',
      category: 'vegetales'
    },
    {
      id: 8,
      name: 'Arroz integral',
      description: 'Arroz integral orgánico, rico en fibra y nutrientes esenciales',
      price: 3500,
      quantity: 20,
      unit: 'kg',
      imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/049/145/100/small_2x/raw-unpolished-rice-on-a-white-acrylic-background-photo.jpg',
      category: 'granos'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Editar producto existente
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...productData }
          : product
      ));
    } else {
      // Agregar nuevo producto
      const newProduct = {
        id: Date.now(), // ID temporal
        ...productData
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
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
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginación simple
  const productsPerPage = 4;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const categories = ['vegetales', 'frutas', 'proteinas', 'lacteos', 'granos', 'otros'];

  return (
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
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="producer-products__filter-btn"
          onClick={() => {}} // Lógica de filtrado ya está en el estado
        >
          Filtrar
        </button>

        <button 
          className="producer-products__clear-btn"
          onClick={handleClearFilters}
        >
          Limpiar
        </button>
      </div>

      <ProductList
        products={paginatedProducts}
        loading={loading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {totalPages > 1 && (
        <div className="producer-products__pagination">
          <button
            className="producer-products__pagination-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`producer-products__pagination-btn ${
                currentPage === page ? 'producer-products__pagination-btn--active' : ''
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          
          <button
            className="producer-products__pagination-btn"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
};

export default ProducerProducts;
