// src/Admin/hooks/useFacturas.ts
import { useState, useEffect } from 'react';
import { getFacturasPage, FacturasPage, PaymentProductDTO } from "../services/facturaService";

interface PaginatorState {
  number: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const useFacturas = (currentPage: number) => {
  // Estado para la lista de facturas
  const [facturas, setFacturas] = useState<PaymentProductDTO[]>([]);
  // Estado para la información de paginación
  const [paginator, setPaginator] = useState<PaginatorState>({
    number: 0,
    totalPages: 1,
    first: true,
    last: false,
  });
  // Estados de loading y error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar una página en particular
  const getFacturas = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getFacturasPage(page, 6); // 6 por página
      const data: FacturasPage = response.data;

      // Actualizamos la lista de facturas
      setFacturas(data.content);
      // Actualizamos el paginador
      setPaginator({
        number: data.number,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error(err);
      setError("Error al cargar las facturas");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para llamar a getFacturas() cuando currentPage cambie
  useEffect(() => {
    getFacturas(currentPage);
  }, [currentPage]);

  return {
    facturas,
    paginator,
    isLoading,
    error,
    // Si quisieras exponer la función para recargar manualmente:
    reloadFacturas: getFacturas,
  };
};
