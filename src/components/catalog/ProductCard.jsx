import { AddToCartIcon } from '../icons'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../../lib/http'
import './Products.css'

const ProductCard = ({ product }) => {

    const useProducer = (producerId) => {
        return useQuery({
            queryKey: ['producer', producerId],
            queryFn: () => fetcher(`auth/userinfo/${producerId}`),
            enabled: !!producerId,
            staleTime: 1000 * 60 * 10,
        })
    }
    const { data: producer, isLoading } = useProducer(product.producerId)

    return (
        <article className="product-card">
            <div className="product-tag">
                {product.productBase?.category ?? 'Sin categoría'}
            </div>

            <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
            </div>

            <div className="product-info">
                <h2>{product.name}</h2>
                <p>{product.description}</p>

                <span className="price">
                    ${product.price}{' '}
                    <span className="unit">/{product.unit?.symbol ?? product.unit?.name ?? ''}</span>
                </span>

                {isLoading ? (
                    <p className="loader">Cargando productor...</p>
                ) : (
                    producer && (
                        <p className="producer">
                            Vendido por:{' '}
                            <span className="producer-link">
                                {producer.fullName}
                            </span>
                        </p>
                    )
                )}

                <button className="add-btn">
                    <AddToCartIcon /> Agregar al Carrito
                </button>
            </div>
        </article>
    )
}

export default ProductCard
