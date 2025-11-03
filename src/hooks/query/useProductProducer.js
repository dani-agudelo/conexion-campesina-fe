import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsProducer, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { showErrorAlert } from "../../utils/sweetAlert";

export const useProductProducerQuery = () => {
  return useQuery({
    queryKey: ["productData"],
    queryFn: getProductsProducer,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productData"] });
    },
    onError: (error) => {
      console.error("Error al crear el producto:", error);
      showErrorAlert('Hubo un error en la creación del producto');
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, productData }) => updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productData"] });
    },
    onError: (error) => {
      console.error("Error al actualizar el producto:", error);
      showErrorAlert('Hubo un error al actualizar el producto');
    },
  });
};


export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productData"] });
    },
    onError: (error) => {
      console.error("Error al eliminar el producto:", error);
      showErrorAlert('Hubo un error al eliminar el producto');
    },
  });
};