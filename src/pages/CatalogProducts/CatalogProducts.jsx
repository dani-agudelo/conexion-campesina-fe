import { useState } from "react";
import CatalogProducts from "../../components/catalog";
import ProductsHeader from "../../components/catalog/ProductsHeader"
import { products as initialProducts } from "../../mocks/products.json";

const CatalogPage = () => {
  const [products] = useState(initialProducts);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 549
  })

  const filterProducts = (products) => {
    return products.filter(product => {
      return (
        product.price >= filters.minPrice && (
          filters.category === 'all' || product.category === filters.category
        )
      )
    })
  }

  const filteredProducts = filterProducts(products)

  return (
    <>
      <ProductsHeader changeFilters={setFilters} />
      <CatalogProducts products={filteredProducts} />
    </>
  );
};
export default CatalogPage;