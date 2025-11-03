import ProductCard from './ProductCard'
import './Products.css'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../../lib/http'
import { useFilters } from '../../state/filters'

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
  const { query, category, sort } = useFilters()

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['offeredProducts', { query, category, sort }],
    queryFn: async () => {
      if (query.trim()) {
        return await fetcher(`product/offer/name/${encodeURIComponent(query.trim())}`)
      }
      if (category !== 'Todas') {
        return await fetcher(`product/offer/category/${encodeURIComponent(category)}`)
      }
      return await fetcher('product/offer') // todos los productos
    },
    staleTime: 1000 * 60 * 5,
  })

  console.log('Productos obtenidos:', products)

  // 🧠 Ordenamiento local (solo en cliente)
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'PrecioAsc') return a.price - b.price
    if (sort === 'PrecioDesc') return b.price - a.price
    if (sort === 'NombreAZ') return a.name.localeCompare(b.name)
    return 0 // Relevancia = sin orden
  })

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
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  )
}

export default CatalogProducts
