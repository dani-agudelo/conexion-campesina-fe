import { fetcher } from "../lib/http";

// Buscar recibo de envío por ID de shipping
export const getShippingById = async (id) => {
  return await fetcher(`shipping/${id}`);
};

// Buscar recibo de envío por ID de orden
export const getShippingByOrder = async (orderId) => {
  return await fetcher(`shipping/order/${orderId}`);
};

// Crear recibo de envío para una orden
export const createShipping = async (orderId) => {
  return await fetcher(`shipping/${orderId}`, {
    method: "POST",
  });
};

export const getDocumentShipping = async (orderId) => {
  // Usamos fetch directamente para obtener el blob
  const API_URL = import.meta.env.VITE_API_URL;
  const tokenData = JSON.parse(localStorage.getItem("token") ?? "{}");
  const token = tokenData?.state?.token;

  const response = await fetch(`${API_URL}/shipping/document/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = (await response.text()) || "Ha ocurrido un error";
    throw new Error(text);
  }

  // Devuelve el blob y el nombre sugerido
  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  let filename = `shipping-receipt-${orderId}.pdf`;
  if (disposition && disposition.includes("filename=")) {
    filename = disposition.split("filename=")[1].replace(/"/g, "");
  }
  return { blob, filename };
};
