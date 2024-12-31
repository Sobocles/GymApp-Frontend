// src/components/Calendar/TrainerCalendar.tsx

import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import apiClient from '../../Apis/apiConfig'; // Asegúrate de que la ruta es correcta
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, CircularProgress } from '@mui/material';
import { getWeeklySlots, bookSlot } from '../../services/calendarService/CalendarService';
import { format as formatDate } from 'date-fns';
// Definición de locales para el localizador
const locales = {
  'en-US': enUS,
  'es': es,
};

// Configuración del localizador
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Lunes como inicio de semana
  getDay,
  locales,
});

// Interfaz para los slots de tiempo
interface TimeSlot {
  trainerId: number;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  available: boolean;
}

// Extensión de la interfaz de Event para incluir slotId
interface CalendarEvent extends Event {
  slotId: string;
}

const TrainerCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<{ open: boolean; severity: 'success' | 'error'; message: string }>({
    open: false,
    severity: 'success',
    message: '',
  });
  const [trainerId, setTrainerId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  // Obtener el email del usuario autenticado desde el estado global
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const token = useSelector((state: RootState) => state.auth.token);

  // Configurar el interceptor de axios para incluir el token en las solicitudes
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    const fetchTrainerId = async () => {
      try {
        const response = await apiClient.get('/users/personal-trainer');
        console.log("aqui esta la response",response);
        const trainer = response.data;
        console.log("aqui esta la response",trainer);
        setTrainerId(trainer.id);
        return trainer.id;
      } catch (error) {
        console.error('Error al obtener el entrenador personal:', error);
        setError('No se pudo obtener el entrenador personal asignado.');
        return null;
      }
    };

    const fetchTimeSlots = async (trainerId: number) => {
      try {
        const timeSlots: TimeSlot[] = await getWeeklySlots(trainerId)
        console.log("aqui los slots",timeSlots);

        // Filtrar solo los slots disponibles
        const availableSlots = timeSlots.filter(slot => slot.available);

        // Transformar los slots en eventos para React Big Calendar
        const calendarEvents: CalendarEvent[] = availableSlots.map(slot => ({
          title: 'Disponible',
          start: new Date(slot.startDateTime),
          end: new Date(slot.endDateTime),
          allDay: false,
          slotId: slot.startDateTime, // Identificador único para la reserva
        }));

        setEvents(calendarEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los slots de tiempo:', error);
        setError('No se pudieron obtener los horarios disponibles.');
        setLoading(false);
      }
    };

    const initializeCalendar = async () => {
      if (email) { // Asegúrate de que el usuario está autenticado
        const fetchedTrainerId = await fetchTrainerId();
        if (fetchedTrainerId) {
          await fetchTimeSlots(fetchedTrainerId);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeCalendar();
  }, [email]);

  // Maneja la selección de un slot disponible (evento)
  const handleSelectEvent = (event: CalendarEvent) => {
    const slotInfo: SlotInfo = {
      start: event.start,
      end: event.end,
      slots: [event.start],
      action: 'select',
    };
    setSelectedSlot(slotInfo);
    setOpenDialog(true);
  };

  // Maneja la selección de un slot no disponible (área vacía)
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Informar al usuario que el slot no está disponible
    setBookingStatus({
      open: true,
      severity: 'error',
      message: 'Este horario no está disponible para reserva.',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSlot(null);
  };

  // Importar format como formatDate para evitar conflictos

  const handleConfirmBooking = async () => {
    if (selectedSlot && trainerId) {
      try {
        // Formatear la fecha y hora en formato ISO 8601
        const slotStartFormatted = formatDate(selectedSlot.start, "yyyy-MM-dd'T'HH:mm:ss");
        console.log('Reservando slot:', { trainerId, slotStart: slotStartFormatted });
  
        const response = await bookSlot(trainerId, slotStartFormatted);
        console.log('Respuesta de reserva:', response);
  
        if (response.status === 200) {
          setBookingStatus({
            open: true,
            severity: 'success',
            message: 'Reserva realizada con éxito.',
          });
  
          // Actualizar los eventos para reflejar la nueva reserva
          setEvents(prevEvents => prevEvents.filter(event => event.start.getTime() !== selectedSlot.start.getTime()));
        } else {
          setBookingStatus({
            open: true,
            severity: 'error',
            message: 'Error al realizar la reserva. Inténtalo de nuevo.',
          });
        }
      } catch (error: any) {
        console.error('Error al reservar el slot:', error);
        setBookingStatus({
          open: true,
          severity: 'error',
          message: error.response?.data || 'Error al realizar la reserva. Inténtalo de nuevo.',
        });
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleCloseSnackbar = () => {
    setBookingStatus(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" style={{ marginTop: '20px' }}>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <h2>Calendario de Entrenador Personal</h2>
      {trainerId ? (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent} // Añadido
          views={['week']}
          defaultView='week'
          popup
          eventPropGetter={(event: CalendarEvent) => ({
            style: {
              backgroundColor: 'green', // Color para slots disponibles
              color: 'white',
            },
          })}
        />
      ) : (
        <Alert severity="warning">No tienes un entrenador personal asignado.</Alert>
      )}

      {/* Diálogo de Confirmación de Reserva */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Reserva</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas reservar este horario?
          </DialogContentText>
          {selectedSlot && (
            <div>
              <p><strong>Fecha:</strong> {selectedSlot.start.toLocaleDateString()}</p>
              <p><strong>Hora:</strong> {selectedSlot.start.toLocaleTimeString()} - {selectedSlot.end.toLocaleTimeString()}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmBooking} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para Notificaciones */}
      <Snackbar open={bookingStatus.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={bookingStatus.severity} sx={{ width: '100%' }}>
          {bookingStatus.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default TrainerCalendar;
