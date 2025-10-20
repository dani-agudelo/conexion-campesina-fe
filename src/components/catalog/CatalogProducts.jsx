import { AddToCartIcon } from '../icons'
import "./Products.css"

const CatalogProducts = ({ products }) => {
  return (
    <main className="products-container">
      <section className="products-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-tag">{product.category}</div>

            <div className="product-image">
              <img src={product.thumbnail} alt={product.title} />
            </div>

            <div className="product-info">
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <span className="price">$ {product.price}</span>
              <button className="add-btn">
                <AddToCartIcon /> Agregar al Carrito
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default CatalogProducts
