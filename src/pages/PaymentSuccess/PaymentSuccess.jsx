import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query'; 

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    Swal.fire({
      icon: 'success',
      title: '¡Pago Exitoso!',
      text: 'Tu orden ha sido procesada y creada exitosamente.',
      confirmButtonColor: '#52a318',
    });

    queryClient.invalidateQueries({ queryKey: ['clientOrders'] });

    const timer = setTimeout(() => {
      navigate('/client-orders', { replace: true }); 
    }, 1500); 

    return () => clearTimeout(timer);
  }, [navigate, queryClient]);

  return (
    <div style={{ padding: '50px', textAlign: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
      <h1>Procesando Pago Exitoso...</h1>
      <p>Serás redirigido automáticamente a tus pedidos.</p>
    </div>
  );
};

export default PaymentSuccess;