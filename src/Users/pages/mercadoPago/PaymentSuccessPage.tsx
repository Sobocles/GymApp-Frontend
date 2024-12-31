import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PaymentDetails {
    paymentId: string | null;
    status: string | null;
    externalReference: string | null;
    // Puedes agregar más propiedades si las necesitas
  }
  

const PaymentSuccessPage = () => {
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log("AQUI LOS PARAMS",params);
    const paymentId = params.get('payment_id');
    const status = params.get('status');
    console.log("AQUI EL STATUS",status);
    const externalReference = params.get('external_reference');
    // Otros parámetros que necesites

    // Puedes usar el paymentId para obtener más detalles desde tu backend
    // Por ejemplo, hacer una solicitud a tu API para obtener detalles del pago y la suscripción

    setPaymentDetails({
      paymentId,
      status,
      externalReference,
      // Otros detalles
    });
  }, [location]);

  return (
    <div>
      <h1>¡Pago Exitoso!</h1>
      {paymentDetails && (
        <div>
          <p>ID de Pago: {paymentDetails.paymentId}</p>
          <p>Estado: {paymentDetails.status}</p>
          {/* Muestra más detalles */}
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
