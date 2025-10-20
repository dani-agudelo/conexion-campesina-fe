import Filters from './Filters'
import './ProductsHeader.css'

const ProductsHeader = ({ changeFilters }) => {
  return (
    <header className="products-header">
      <Filters changeFilters={changeFilters} />
    </header>
  )
}

export default ProductsHeader
