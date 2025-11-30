import './ProductInfo.css';

const ProductInfo = ({ product }) => {
  return (
    <div className="description-container">
      <h2 className="section-title">Descripcion</h2>
      <p className="description-text">
        {product.description || "Sin descripción disponible"}
      </p>
    </div>
  );
};

export default ProductInfo;