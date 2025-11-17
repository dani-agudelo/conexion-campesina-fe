import { useEffect, useMemo, useState } from "react";
import "./ClientOrdersTable.css";
import { useClientOrdersQuery } from "../../../hooks/query/useClientOrders";
import { Spinner } from "../../ui/spinner/Spinner";
import { EyeIcon, TruckIcon, XIcon } from "../../icons";

const ordersPerPage = 7;

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

const getStatusLabel = (status) => {
  const statusMap = {
    PAID: "Pagado",
    PENDING: "Pendiente",
    CANCELLED: "Cancelado",
    DELIVERED: "Entregado",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const statusClassMap = {
    PAID: "client-orders__status--paid",
    PENDING: "client-orders__status--pending",
    CANCELLED: "client-orders__status--cancelled",
    DELIVERED: "client-orders__status--delivered",
  };
  return statusClassMap[status] || "";
};

const ClientOrdersTable = () => {
  const { data: orders = [], isPending, isError } = useClientOrdersQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(orders.length / ordersPerPage),
    [orders.length]
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
  const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  const showingFrom = orders.length === 0 ? 0 : startIndex + 1;
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
      <div className="client-orders__loader">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="client-orders__state client-orders__state--error">
        <h2>Hubo un problema al cargar tus pedidos</h2>
        <p>No se pudieron cargar los pedidos. Por favor, intenta de nuevo más tarde.</p>
      </div>
    );
  }

  return (
    <section className="client-orders">
      <header className="client-orders__header">
        <div>
          <h1 className="client-orders__title">Mis Pedidos</h1>
          <p className="client-orders__subtitle">
            Revisa el estado y detalles de todos tus pedidos.
          </p>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="client-orders__state">
          <h2>No tienes pedidos todavía</h2>
          <p>Cuando realices un pedido aparecerá en esta sección.</p>
        </div>
      ) : (
        <>
          <div className="client-orders__table-wrapper">
            <table className="client-orders__table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td className="client-orders__id">
                      {buildOrderCode(order, index)}
                    </td>
                    <td>{formatDate(order.orderDate || order.createdAt)}</td>
                    <td>
                      <span className={`client-orders__status ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="client-orders__total">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td>{order.totalItems ?? order.orderDetails?.length ?? "-"}</td>
                    <td className="client-orders__address">
                      {order.address || "-"}
                    </td>
                    <td>
                      <div className="client-orders__actions">
                        <button
                          type="button"
                          className="client-orders__button client-orders__button--icon"
                          onClick={() => {
                            console.info("Ver detalles del pedido:", order.id);
                          }}
                          aria-label="Ver detalles"
                          title="Ver detalles"
                        >
                          <EyeIcon size={18} />
                        </button>
                        {order.status === "PENDING" && (
                          <button
                            type="button"
                            className="client-orders__button client-orders__button--icon"
                            onClick={() => {
                              console.info("Cancelar pedido:", order.id);
                            }}
                            aria-label="Cancelar pedido"
                            title="Cancelar pedido"
                          >
                            <XIcon size={18} />
                          </button>
                        )}
                        {order.status === "PAID" && (
                          <button
                            type="button"
                            className="client-orders__button client-orders__button--secondary client-orders__button--icon"
                            onClick={() => {
                              console.info("Ver información de envío:", order.id);
                            }}
                            aria-label="Ver información de envío"
                            title="Ver información de envío"
                          >
                            <TruckIcon size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="client-orders__footer">
            <div className="client-orders__summary">
              Mostrando {showingFrom}-{showingTo} de {orders.length}
            </div>
            {totalPages > 1 && (
              <div className="client-orders__pagination">
                <button
                  type="button"
                  className="client-orders__page-button"
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
                      className={`client-orders__page-button ${
                        page === currentPage ? "client-orders__page-button--active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="client-orders__page-button"
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

export default ClientOrdersTable;

