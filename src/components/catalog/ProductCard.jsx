import { useState, useCallback } from 'react'
import { AddToCartIcon } from '../icons'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../../lib/http'
import { useCart } from '../../state/cart'
import QuantityModal from './QuantityModal'
import './Products.css'

const unitSymbols = {
    KILOGRAMO: 'Kg',
    GRAMO: 'g',
    LITRO: 'L',
    MILILITRO: 'mL',
    TONELADA: 't',
    LIBRA: 'lb',
    ARROBA: 'arroba',
    CARGA: 'Carga',
    BULTO: 'Bulto',
    SACO: 'Saco',
    CAJA: 'Caja',
    CANASTA: 'Canasta',
    ATADO: 'Atado',
    MANOJO: 'Manojo',
    RACIMO: 'Racimo',
    UNIDAD: 'Unidad',
    DOCENA: 'Docena',
    MEDIA_DOCENA: '½ Docena',
    PAR: 'Par',
    CUARTILLA: 'Cuartilla',
    BOTELLA: 'Botella',
}

const ProductCard = ({ product }) => {
    const [showQuantityModal, setShowQuantityModal] = useState(false)
    const addItem = useCart((state) => state.addItem)

    const useProducer = (producerId) => {
        return useQuery({
            queryKey: ['producer', producerId],
            queryFn: () => fetcher(`auth/userinfo/${producerId}`),
            enabled: !!producerId,
            staleTime: 1000 * 60 * 10,
        })
    }
    const { data: producer } = useProducer(product.producerId)

    const handleAddToCart = useCallback((quantity) => {
        addItem(product, quantity)
    }, [product, addItem])

    const handleOpenModal = useCallback(() => {
        setShowQuantityModal(true)
    }, [])

    const handleCloseModal = useCallback(() => {
        setShowQuantityModal(false)
    }, [])

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
                    <span className="unit">
                        /{unitSymbols[product.unit] ?? product.unit ?? ''}
                    </span>
                </span>
                {producer && (
                    <p className="producer">
                        Vendido por:{' '}
                        <span className="producer-link">
                            {producer.fullName}
                        </span>
                    </p>
                )}

                <button
                    className="add-btn"
                    onClick={handleOpenModal}
                >
                    <AddToCartIcon /> Agregar al Carrito
                </button>
            </div>

            <QuantityModal
                isOpen={showQuantityModal}
                onClose={handleCloseModal}
                onConfirm={handleAddToCart}
                productName={product.name}
                unit={product.unit}
            />
        </article>
    )
}

export default ProductCard
