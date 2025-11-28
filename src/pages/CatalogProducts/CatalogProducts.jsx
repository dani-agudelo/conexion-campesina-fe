import CatalogProducts from "../../components/catalog";
import ProductsHeader from "../../components/catalog/ProductsHeader";
import "./CatalogProducts.css";

const CatalogPage = () => {
  return (
    <div className="catalog-page">
      <div className="catalog-page__header">
        <ProductsHeader />
      </div>
      <div className="catalog-page__content">
        <CatalogProducts />
      </div>
    </div>
  );
};
export default CatalogPage;