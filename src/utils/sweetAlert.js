import Swal from 'sweetalert2';

// Configuración base personalizada
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

// Funciones reutilizables
export const showSuccessAlert = (message) => {
  return Swal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#10b981',
  });
};

export const showErrorAlert = (message) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#ef4444',
  });
};

export const showWarningAlert = (message) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Advertencia',
    text: message,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#f59e0b',
  });
};

export const showConfirmAlert = async (title, text) => {
  const result = await Swal.fire({
    icon: 'question',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
  });
  return result.isConfirmed;
};

export const showConfirmDialog = async (message) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
    reverseButtons: true
  });
  return result.isConfirmed;
};

export const showToast = (message, type = 'success') => {
  return Toast.fire({
    icon: type,
    title: message
  });
};

export const showLoadingAlert = (message = 'Cargando...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export default Swal;