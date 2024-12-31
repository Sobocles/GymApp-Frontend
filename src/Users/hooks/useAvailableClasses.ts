// src/hooks/useAvailableClasses.ts

import { useEffect, useState } from 'react';
import { getAvailableGroupClasses, GroupClass, bookGroupClass } from '../../Users/services/groupClassService';

export const useAvailableClasses = () => {
  const [classes, setClasses] = useState<GroupClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAvailableGroupClasses();
      setClasses(data);
    } catch (err: any) {
      setError('Error al obtener las clases disponibles');
    } finally {
      setLoading(false);
    }
  };

  const bookClassById = async (classId: number) => {
    try {
      setLoading(true);
      setError(null);
      await bookGroupClass(classId);
      // Podríamos refrescar la lista después de reservar, o mostrar un mensaje:
      alert('Clase reservada con éxito');
      await fetchClasses();
    } catch (err: any) {
      setError('Error al reservar la clase. Verifica si tienes un plan activo o si estás en el rango de reserva.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, error, bookClassById };
};
