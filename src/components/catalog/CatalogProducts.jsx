import ProductCard from './ProductCard'
import './Products.css'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../../lib/http'

const SkeletonCard = () => (
  <article className="product-card skeleton-card">
    <div className="skeleton skeleton-image"></div>
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-price"></div>
    <div className="skeleton skeleton-btn"></div>
  </article>
)

const CatalogProducts = () => {
  const useProducts = () => {
    return useQuery({
      queryKey: ['offeredProducts'],
      queryFn: () => fetcher('product/offer'),
      staleTime: 1000 * 60 * 5,
    })
  }

  const { data: products = [], isLoading, isError } = useProducts()

  if (isLoading) {
    return (
      <main className="products-container">
        <section className="products-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </section>
      </main>
    )
  }

  if (isError) return <p>Error al cargar productos.</p>

  return (
    <main className="products-container">
      <section className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  )
}

export default CatalogProducts
