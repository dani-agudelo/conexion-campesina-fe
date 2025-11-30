import { useEffect, useMemo, useState, useRef } from "react";
import "./ClientOrdersTable.css";
import { useClientOrdersQuery } from "../../../hooks/query/useClientOrders";
import { Spinner } from "../../ui/spinner/Spinner";
import {
  EyeIcon,
  TruckIcon,
  XIcon,
  DownloadIcon,
  FilePlusIcon,
  FileTextIcon
} from "../../icons";
import OrderDetailsModal from "../../orders/OrderDetailsModal";
import {
  useShippingByOrder,
  useCreateShippingMutation,
} from "../../../hooks/query/useShipping";
import { showSuccessAlert, showErrorAlert } from "../../../utils/sweetAlert";
import { getDocumentShipping } from "../../../services/shippingService";

const ordersPerPage = 6;

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
  const [shippingLoading, setShippingLoading] = useState({});
  const shippingDocsRef = useRef({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  // CORRECCIÓN: Llamar a los hooks FUERA del map, para todas las órdenes paginadas
  const shippingQueries = [
    useShippingByOrder(paginatedOrders[0]?.id),
    useShippingByOrder(paginatedOrders[1]?.id),
    useShippingByOrder(paginatedOrders[2]?.id),
    useShippingByOrder(paginatedOrders[3]?.id),
    useShippingByOrder(paginatedOrders[4]?.id),
    useShippingByOrder(paginatedOrders[5]?.id),
  ];

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

  const createShipping = useCreateShippingMutation();

  const handleDownload = async (orderId) => {
    setShippingLoading((prev) => ({ ...prev, [orderId]: "downloading" }));
    try {
      const { blob, filename } = await getDocumentShipping(orderId);
      shippingDocsRef.current[orderId] = { blob, filename };
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      showSuccessAlert("Comprobante descargado correctamente");
    } catch {
      showErrorAlert("No se pudo descargar el comprobante");
    } finally {
      setShippingLoading((prev) => ({ ...prev, [orderId]: null }));
    }
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
        <p>
          No se pudieron cargar los pedidos. Por favor, intenta de nuevo más
          tarde.
        </p>
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
                {paginatedOrders.map((order, index) => {
                  const { data: shipping, isLoading: loadingShipping } =
                    shippingQueries[index];
                  return (
                    <tr key={order.id}>
                      <td className="client-orders__id">
                        {buildOrderCode(order, index)}
                      </td>
                      <td>{formatDate(order.orderDate || order.createdAt)}</td>
                      <td>
                        <span
                          className={`client-orders__status ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="client-orders__total">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td>
                        {order.totalItems ?? order.orderDetails?.length ?? "-"}
                      </td>
                      <td className="client-orders__address">
                        {order.address || "-"}
                      </td>
                      <td className="client-orders__actions-cell">
                        <div className="client-orders__actions">
                          <button
                            type="button"
                            className="client-orders__button client-orders__button--icon"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsModalOpen(true);
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
                          {/* Botones de comprobante de envío - disponibles para pedidos PAID, DELIVERED o PENDING (prueba) */}
                          {(order.status === "PAID" || order.status === "DELIVERED" || order.status === "PENDING") && (
                            <>
                              {loadingShipping ? (
                                <button
                                  type="button"
                                  className="client-orders__button client-orders__button--icon"
                                  disabled
                                  aria-label="Cargando información de envío"
                                  title="Cargando..."
                                >
                                  <Spinner size={18} />
                                </button>
                              ) : shipping && shipping.id ? (
                                // SI EXISTE el comprobante - Mostrar botón de descarga
                                <button
                                  type="button"
                                  className="client-orders__button client-orders__button--secondary client-orders__button--icon"
                                  disabled={
                                    shippingLoading[order.id] === "downloading"
                                  }
                                  onClick={() => handleDownload(order.id)}
                                  aria-label="Descargar comprobante de envío"
                                  title="Descargar comprobante de envío"
                                >
                                  {shippingLoading[order.id] === "downloading" ? (
                                    <Spinner size={18} />
                                  ) : (
                                    <DownloadIcon size={18} />
                                  )}
                                </button>
                              ) : (
                                // NO EXISTE el comprobante - Mostrar botón de generar
                                <button
                                  type="button"
                                  className="client-orders__button client-orders__button--primary client-orders__button--icon"
                                  disabled={
                                    createShipping.isPending ||
                                    shippingLoading[order.id] === "generating"
                                  }
                                  onClick={async () => {
                                    setShippingLoading((prev) => ({
                                      ...prev,
                                      [order.id]: "generating",
                                    }));
                                    createShipping.mutate(order.id, {
                                      onSuccess: () => {
                                        showSuccessAlert(
                                          "Comprobante de envío generado correctamente"
                                        );
                                      },
                                      onError: () => {
                                        showErrorAlert(
                                          "No se pudo generar el comprobante de envío"
                                        );
                                      },
                                      onSettled: () => {
                                        setShippingLoading((prev) => ({
                                          ...prev,
                                          [order.id]: null,
                                        }));
                                      },
                                    });
                                  }}
                                  aria-label="Generar comprobante de envío"
                                  title="Generar comprobante de envío"
                                >
                                  {shippingLoading[order.id] === "generating" ? (
                                    <Spinner size={18} />
                                  ) : (
                                    <FilePlusIcon size={18} />
                                  )}
                                </button>
                              )}
                            </>
                          )}
                          {/* Botón para ver recibo (Tu cambio recuperado) */}
                          {order.status === "PAID" && (
                            <button
                              type="button"
                              className="client-orders__button client-orders__button--secondary client-orders__button--icon"
                              onClick={() => {
                                if (order.orderReceipt?.receiptUrl) window.open(order.orderReceipt.receiptUrl, '_blank');
                              }}
                              aria-label="Ver recibo de pago"
                              title="Ver recibo de pago"
                            >
                              <FileTextIcon size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
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
                      className={`client-orders__page-button ${page === currentPage
                          ? "client-orders__page-button--active"
                          : ""
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

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </section>
  );
};

export default ClientOrdersTable;