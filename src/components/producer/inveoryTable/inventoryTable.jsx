import './inventoryTable.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducerInventoryQuery, useDeleteInventoryMutation } from "../../../hooks/query/useProducerInventoryQuery";
import InventoryForm from '../InventoryForm/InventoryForm';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../utils/sweetAlert';
import { EditIcon, DeleteIcon } from '../../icons';

const Spinner = () => (
    <div className="inventory-loader">
        <div className="spinner"></div>
    </div>
);

const getInventoryStatus = (available, min, max) => {
    const percentage = Math.max(0, (available / max) * 100);
    let statusClass = "status--high";

    if (available <= min) {
        statusClass = "status--low";
    } else if (available < max * 0.4) {
        statusClass = "status--medium";
    }

    return {
        statusClass,
        progressPercentage: Math.min(100, percentage).toFixed(1),
    };
};

const App = () => {
    const navigate = useNavigate();
    const { data: inventory = [], isPending, isError, error } = useProducerInventoryQuery();
    const deleteMutation = useDeleteInventoryMutation();

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        const confirmed = await showConfirmDialog(
            '¿Estás seguro?',
            `Se eliminará el inventario de "${name}". Esta acción no se puede deshacer.`,
            'Sí, eliminar',
            'Cancelar'
        );

        if (confirmed) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    showSuccessAlert('Inventario eliminado correctamente');
                },
                onError: (error) => {
                    showErrorAlert(error?.message || 'No se pudo eliminar el inventario');
                }
            });
        }
    };

    const handleAddProduct = () => {
        navigate('/product-management/products?action=create');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    let content;

    if (isPending) {
        content = (
            <div className="inventory-state">
                <Spinner />
            </div>
        );
    } else if (isError) {
        content = (
            <div className="inventory-state inventory-state--error">
                <h2>Error al cargar el inventario</h2>
                <p>{error?.message ?? "Inténtalo de nuevo más tarde."}</p>
            </div>
        );
    } else if (inventory.length === 0) {
        content = (
            <div className="inventory-state">
                <h2>No tienes productos en inventario</h2>
                <p>Primero crea un producto en "Mis Productos" para configurar tu inventario.</p>
                <button
                    className="inventory-state__action-btn"
                    onClick={handleAddProduct}
                >
                    ➕ Ir a Mis Productos
                </button>
            </div>
        );
    } else {
        content = (
            <div className="inventory__table-wrapper">
                <table className="inventory__table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad Disponible</th>
                            <th>Unidad</th>
                            <th>Umbral Mínimo</th>
                            <th>Capacidad Máxima</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => {
                            const { statusClass, progressPercentage } = getInventoryStatus(
                                item.available,
                                item.minThreshold,
                                item.maxCapacity
                            );

                            return (
                                <tr key={item.id}>
                                    <td className="inventory__product-name">{item.name}</td>

                                    <td>
                                        <div className="inventory__quantity-cell">
                                            <div
                                                className={`inventory__progress-bar ${statusClass}`}
                                                style={{ "--progress-width": `${progressPercentage}%` }}
                                            >
                                                <div className="inventory__progress-fill"></div>
                                            </div>
                                            <span className="inventory__available-quantity">{item.available}</span>
                                        </div>
                                    </td>

                                    <td>{item.unit}</td>
                                    <td>{item.minThreshold} {item.unit}</td>
                                    <td>{item.maxCapacity} {item.unit}</td>

                                    <td>
                                        <div className="inventory__actions">
                                            <button
                                                className="product-card__action-btn product-card__action-btn--edit"
                                                onClick={() => handleEdit(item)}
                                                aria-label="Editar inventario"
                                                title="Editar inventario"
                                            >
                                                <EditIcon size={18} />
                                            </button>

                                            <button
                                                className="product-card__action-btn product-card__action-btn--delete"
                                                onClick={() => handleDelete(item.id, item.name)}
                                                aria-label="Eliminar inventario"
                                                title="Eliminar inventario"
                                                disabled={deleteMutation.isPending}
                                            >
                                                <DeleteIcon size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="producer-inventory-page">
            <section className="producer-inventory">
                <header className="inventory__header">
                    <div>
                        <h1 className="inventory__title">Mi Inventario</h1>
                        <p className="inventory__subtitle">Gestiona la disponibilidad de tus productos.</p>
                    </div>

                    <button
                        className="inventory__add-button"
                        onClick={handleAddProduct}
                    >
                        <span className="producer-products__add-icon">+</span>

                        Crear Producto
                    </button>
                </header>

                {content}
            </section>

            {showModal && (
                <InventoryForm
                    editingItem={editingItem}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default App;