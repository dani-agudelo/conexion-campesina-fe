import './UserProfile.css';
import { useState, useEffect } from 'react'; // Importamos hooks necesarios
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserInfo, updateUserInfo } from '../../../services/users';
import { showErrorAlert, showSuccessAlert } from '../../../utils/sweetAlert';

const getInitials = (fullName = "") => {
    const parts = fullName.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const last = parts[1]?.[0] || "";
    return (first + last).toUpperCase();
};

const UserProfile = () => {
    const queryClient = useQueryClient();
    
    // Estado local para los campos del formulario
    const [formData, setFormData] = useState({
        fullName: '',
        address: ''
    });

    const { data: { user } = {}, isLoading, isError, error } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserInfo,
        refetchOnWindowFocus: false,
    });

    // Sincronizar el estado del formulario cuando llegan los datos del usuario
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: updateUserInfo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            showSuccessAlert('Información actualizada con éxito');
        },
        onError: () => {
            showErrorAlert('Error al actualizar la información');
        }
    });

    // Manejador de cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Verificar si hay cambios reales comparando con la data original (user)
    const hasChanges = () => {
        if (!user) return false;
        
        // Comparamos valores recortados (trim) para evitar falsos positivos por espacios
        const currentName = formData.fullName.trim();
        const currentAddress = formData.address.trim();
        const originalName = (user.fullName || '').trim();
        const originalAddress = (user.address || '').trim();

        return currentName !== originalName || currentAddress !== originalAddress;
    };

    const isDirty = hasChanges();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Si no hay cambios, no hacemos nada (aunque el botón debería estar deshabilitado)
        if (!isDirty) return;

        const payload = {};
        
        // Solo agregamos al payload los campos que cambiaron
        const currentName = formData.fullName.trim();
        const currentAddress = formData.address.trim();
        
        if (currentName !== (user.fullName || '').trim()) {
            payload.fullName = currentName;
        }
        
        if (currentAddress !== (user.address || '').trim()) {
            payload.address = currentAddress;
        }

        // Enviamos la mutación solo con el objeto 'payload' filtrado
        mutation.mutate(payload);
    };

    if (isLoading) return <div className="profile-container">Cargando perfil...</div>;
    if (isError) return <div className="profile-container">Error: {error.message}</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">

                <div className="profile-sidebar">
                    <div className="avatar-fallback">
                        {getInitials(user?.fullName)}
                    </div>
                    <h2 className="user-name">{user?.fullName}</h2>
                </div>

                <div className="profile-content">
                    <h3 className="section-title">Información personal</h3>

                    <form className="profile-form" onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="fullName">Nombre completo</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    // Cambiamos defaultValue por value (input controlado)
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="form-input"
                                    required 
                                />
                                <PencilIcon className="input-icon" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Dirección</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    // Cambiamos defaultValue por value
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                                <PencilIcon className="input-icon" />
                            </div>
                        </div>

                        {mutation.isError && (
                            <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
                                {mutation.error.message}
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-save"
                                disabled={mutation.isPending || !isDirty}
                                style={{ opacity: (!isDirty || mutation.isPending) ? 0.6 : 1, cursor: (!isDirty || mutation.isPending) ? 'not-allowed' : 'pointer' }}
                            >
                                {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

const PencilIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);

export { UserProfile };