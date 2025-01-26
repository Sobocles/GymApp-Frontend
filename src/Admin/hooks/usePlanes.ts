// src/Admin/hooks/usePlanes.ts
import { useState, useEffect } from "react";
import { PaymentPlanDTO, PlanesPage, getPlanesPage } from "../services/facturaService";

interface PaginatorState {
  number: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const usePlanes = (currentPage: number) => {
  const [planes, setPlanes] = useState<PaymentPlanDTO[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    number: 0,
    totalPages: 1,
    first: true,
    last: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanesPage = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getPlanesPage(page, 6); // 6 por página
      const data: PlanesPage = response.data;
      setPlanes(data.content);
      setPaginator({
        number: data.number,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err: any) {
      console.error(err);
      setError("Error al obtener los pagos aprobados de planes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanesPage(currentPage);
  }, [currentPage]);

  return {
    planes,
    paginator,
    isLoading,
    error,
    reloadPlanes: fetchPlanesPage, // por si necesitas recargar manualmente
  };
};
