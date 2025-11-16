import './Users.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { changeUserStatus } from '../../services/users';
import { UserStatus } from '../../constants/user';
import { Spinner } from '../../components/ui/spinner/Spinner'
import { useUsers } from '../../hooks/query/useUsers';
import { showConfirmDialog, showErrorAlert, showSuccessAlert } from '../../utils/sweetAlert';

const UsersPage = () => {
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useUsers();

    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, newStatus }) => changeUserStatus(id, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: error => {
            console.error(error);
            showErrorAlert('No se pudo actualizar el estado!')
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: userId => changeUserStatus(userId, UserStatus.DELETED),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showSuccessAlert('Usuario eliminado correctamente!');
        },
        onError: error => {
            console.error(error);
            showErrorAlert('No se pudo eliminar el usuario');
        },
    });

    const handleToggleStatus = (userId, currentStatus) => {
        const status = currentStatus === 'ACTIVE' ? UserStatus.INACTIVE : UserStatus.ACTIVE;

        console.log('status to send: ', status)
        toggleStatusMutation.mutate({ id: userId, newStatus: status });
    };

    const handleDeleteUser = async userId => {
        const isConfirmed = await showConfirmDialog('No podrás revertir esta acción');

        if (isConfirmed) {
            deleteUserMutation.mutate(userId);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.fullName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
                || user.email.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesRole = roleFilter === 'Todos' || user.role === roleFilter;

            const userStatusString =
                user.status === UserStatus.ACTIVE ? 'Activo' : 'Inactivo';
            const matchesStatus =
                statusFilter === 'Todos' || userStatusString === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    if (isLoading) return <Spinner />

    return (
        <div className="dashboard-container">
            <div className="header-section">
                <div className="header-text">
                    <h1>Gestión de Usuarios</h1>
                    <p>Administra, activa y desactiva las cuentas de la plataforma.</p>
                </div>
            </div>

            <div className="main-card">
                {/* Barra de Filtros */}
                <div className="filters-bar">
                    <div className="search-wrapper">
                        <svg
                            className="search-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-actions">
                        <div className="select-container">
                            <select
                                className="custom-select"
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value)}
                            >
                                <option value="Todos">Rol: Todos</option>
                                <option value="PRODUCER">Productor</option>
                                <option value="CLIENT">Cliente</option>
                            </select>
                            <svg
                                className="chevron-down"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>

                        <div className="select-container">
                            <select
                                className="custom-select"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="Todos">Estado: Todos</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                            <svg
                                className="chevron-down"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="table-responsive">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>NOMBRE</th>
                                <th>EMAIL</th>
                                <th>ROL</th>
                                <th>ESTADO</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="font-bold">{user.fullName}</td>
                                        <td className="text-gray">{user.email}</td>
                                        <td className="text-gray">{user.role}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${user.status === UserStatus.ACTIVE
                                                    ? 'activo'
                                                    : 'inactivo'
                                                    }`}
                                            >
                                                {user.status === UserStatus.ACTIVE
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-group">
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={user.status === UserStatus.ACTIVE}
                                                        onChange={() =>
                                                            handleToggleStatus(
                                                                user.id,
                                                                user.status
                                                            )
                                                        }
                                                    />
                                                    <span className="slider round"></span>
                                                </label>

                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <svg
                                                        fill="none"
                                                        stroke="#b30b0b"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        style={{
                                            textAlign: 'center',
                                            padding: '20px',
                                            color: '#666',
                                        }}
                                    >
                                        No se encontraron resultados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer">
                    <span className="footer-text">
                        Mostrando {filteredUsers.length} de {users.length} usuarios
                    </span>
                    <div className="pagination-buttons">
                        <button className="btn-page">Anterior</button>
                        <button className="btn-page">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { UsersPage };
