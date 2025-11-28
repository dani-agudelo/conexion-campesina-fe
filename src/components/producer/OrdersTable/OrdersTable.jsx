import { useEffect, useMemo, useState } from "react";
import "./OrdersTable.css";
import { useProducerOrdersQuery } from "../../../hooks/query/useProducerOrders";
import { Spinner } from "../../ui/spinner/Spinner";

const ordersPerPage = 5;

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const resolveClientName = (order) =>
  order?.clientName || "Cliente";

const OrdersTable = () => {
  const { data: paidOrders = [], isPending, isError, error } = useProducerOrdersQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(paidOrders.length / ordersPerPage),
    [paidOrders.length]
  );

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = paidOrders.slice(startIndex, startIndex + ordersPerPage);

  const showingFrom = paidOrders.length === 0 ? 0 : startIndex + 1;
  const showingTo = startIndex + paginatedOrders.length;

  const buildOrderCode = (order, index) => {
    const baseDate = order?.orderDate || order?.createdAt;
    const date = baseDate ? new Date(baseDate) : null;

    if (date && !Number.isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const sequence = String(startIndex + index + 1).padStart(3, "0");
      return `#CC-${year}${month}-${sequence}`;
    }

    return `#CC-${(order?.id || "").slice(0, 6).toUpperCase()}`;
  };

  if (isPending) {
    return (
      <div className="producer-orders__loader">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="producer-orders__state producer-orders__state--error">
        <h2>Hubo un problema al cargar tus pedidos</h2>
        <p>{error?.message ?? "Inténtalo de nuevo más tarde."}</p>
      </div>
    );
  }

  return (
    <section className="producer-orders">
      <header className="producer-orders__header">
        <div>
          <h1 className="producer-orders__title">Pedidos Pagados</h1>
          <p className="producer-orders__subtitle">
            Gestiona los pedidos que tus clientes ya han pagado.
          </p>
        </div>
      </header>

      {paidOrders.length === 0 ? (
        <div className="producer-orders__state">
          <h2>No tienes pedidos pagados todavía</h2>
          <p>Cuando recibas pagos aparecerán en esta sección.</p>
        </div>
      ) : (
        <>
          <div className="producer-orders__table-wrapper">
            <table className="producer-orders__table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td className="producer-orders__id">
                      {buildOrderCode(order, index)}
                    </td>
                    <td>{resolveClientName(order)}</td>
                    <td>{formatDate(order.orderDate || order.createdAt)}</td>
                    <td className="producer-orders__total">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td>{order.totalItems ?? order.orderDetails?.length ?? "-"}</td>
                    <td>
                      <div className="producer-orders__actions">
                        <button
                          type="button"
                          className="producer-orders__button producer-orders__button--primary"
                          onClick={() => {
                            // TODO: Implementar flujo de procesamiento
                            console.info("Procesar envío:", order.id);
                          }}
                        >
                          Procesar envío
                        </button>
                        <button
                          type="button"
                          className="producer-orders__button producer-orders__button--ghost"
                          onClick={() => {
                            console.info("Ver detalles del pedido:", order.id);
                          }}
                          aria-label="Ver detalles del pedido"
                        >
                          Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="producer-orders__footer">
            <div className="producer-orders__summary">
              Mostrando {showingFrom}-{showingTo} de {paidOrders.length}
            </div>
            {totalPages > 1 && (
              <div className="producer-orders__pagination">
                <button
                  type="button"
                  className="producer-orders__page-button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, pageIndex) => {
                  const page = pageIndex + 1;
                  return (
                    <button
                      key={page}
                      type="button"
                      className={`producer-orders__page-button ${
                        page === currentPage ? "producer-orders__page-button--active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="producer-orders__page-button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </footer>
        </>
      )}
    </section>
  );
};

export default OrdersTable;


