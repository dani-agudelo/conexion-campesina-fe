// src/pages/PaymentSuccess/PaymentSuccess.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query'; // Para invalidar la caché

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Mostrar el mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Pago Exitoso!',
      text: 'Tu orden ha sido procesada y creada exitosamente.',
      confirmButtonColor: '#52a318',
    });

    // 2. Invalida la caché de pedidos para que la tabla muestre la nueva orden al cargar.
    queryClient.invalidateQueries({ queryKey: ['clientOrders'] });

    // 3. Redirigir al usuario a la lista de pedidos
    // Usamos setTimeout para que el Swal se muestre al menos un segundo.
    const timer = setTimeout(() => {
      // Reemplaza la entrada del historial para que el usuario no regrese a esta página vacía.
      navigate('/client-orders', { replace: true }); 
    }, 1500); // Espera 1.5 segundos

    return () => clearTimeout(timer);
  }, [navigate, queryClient]);

  return (
    <div style={{ padding: '50px', textAlign: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
      <h1>✅ Procesando Pago Exitoso...</h1>
      <p>Serás redirigido automáticamente a tus pedidos.</p>
      {/* Opcional: Agregar un spinner o loader si la redirección tarda */}
    </div>
  );
};

export default PaymentSuccess;