import React from 'react';
import ProductCard from '../ProductCard';
import './ProductList.css';

const ProductList = ({ products, loading, onEdit, onDelete, onAddInventory }) => {
  if (loading) {
    return (
      <div className="product-list">
        <div className="product-list__loading">
          <div className="product-list__spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list">
        <div className="product-list__empty">
          <div className="product-list__empty-icon">📦</div>
          <h3>No tienes productos registrados</h3>
          <p>Comienza agregando tu primer producto para vender en la plataforma</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list__table-container">
        <table className="product-list__table">
          <thead className="product-list__header">
            <tr>
              <th className="product-list__header-cell">PRODUCTO</th>
              <th className="product-list__header-cell">DESCRIPCIÓN</th>
              <th className="product-list__header-cell">PRECIO</th>
              <th className="product-list__header-cell">CANTIDAD</th>
              <th className="product-list__header-cell">ESTADO</th>
              <th className="product-list__header-cell">DISPONIBILIDAD</th>
              <th className="product-list__header-cell">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="product-list__body">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddInventory={onAddInventory}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;