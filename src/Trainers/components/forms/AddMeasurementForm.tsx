import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box, Button, TextField, Typography, Alert, Checkbox, FormControlLabel, Divider
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { addBodyMeasurement } from '../../services/trainerClientService';

interface AddMeasurementFormProps {
  clientId: number; // ID del cliente
}

const AddMeasurementForm: React.FC<AddMeasurementFormProps> = ({ clientId }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const validationSchema = Yup.object({

    date: Yup.date().required('Fecha de evaluación es requerida'),
    clientName: Yup.string(),
    age: Yup.number().positive('Debe ser positivo'),
    injuries: Yup.string(),
    otherHealthInfo: Yup.string(),
    medications: Yup.string(),
    currentlyExercising: Yup.boolean(),
    sportsPracticed: Yup.string(),
    weight: Yup.number().positive('Debe ser positivo'),
    bmi: Yup.number().positive('Debe ser positivo'),
    relaxedArm: Yup.number().positive('Debe ser positivo'),
    waist: Yup.number().positive('Debe ser positivo'), //cintura
    midThigh: Yup.number().positive('Debe ser positivo'),
    flexedArm: Yup.number().positive('Debe ser positivo'),
    hips: Yup.number().positive('Debe ser positivo'),
    calf: Yup.number().positive('Debe ser positivo'),
    tricepFold: Yup.number().positive('Debe ser positivo'),
    subscapularFold: Yup.number().positive('Debe ser positivo'),
    bicepFold: Yup.number().positive('Debe ser positivo'),
    suprailiacFold: Yup.number().positive('Debe ser positivo'),
    sumOfFolds: Yup.number().positive('Debe ser positivo'),
    percentageOfFolds: Yup.number().positive('Debe ser positivo'),
    fatMass: Yup.number().positive('Debe ser positivo'),
    leanMass: Yup.number().positive('Debe ser positivo'),
    muscleMass: Yup.number().positive('Debe ser positivo'),
    idealMinWeight: Yup.number().positive('Debe ser positivo'),
    idealMaxWeight: Yup.number().positive('Debe ser positivo'),
    trainerRecommendations: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      clientName: '',
      age: '',
      injuries: '',
      otherHealthInfo: '',
      medications: '',
      currentlyExercising: false,
      sportsPracticed: '',
      weight: '',
      bmi: '',
      relaxedArm: '',
      waist: '',
      midThigh: '',
      flexedArm: '',
      hips: '',
      calf: '',
      tricepFold: '',
      subscapularFold: '',
      bicepFold: '',
      suprailiacFold: '',
      sumOfFolds: '',
      percentageOfFolds: '',
      fatMass: '',
      leanMass: '',
      muscleMass: '',
      idealMinWeight: '',
      idealMaxWeight: '',
      trainerRecommendations: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      setSubmitSuccess(false);
      try {
        const dateStr = format(values.date, "yyyy-MM-dd'T'HH:mm:ss");
        await addBodyMeasurement(clientId, { ...values, date: dateStr });
        setSubmitSuccess(true);
        formik.resetForm();
      } catch (error: any) {
        console.error('Error al agregar medición:', error);
        setSubmitError(error.response?.data || 'Error al agregar la medición');
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Agregar Medición Corporal</Typography>
      <form onSubmit={formik.handleSubmit}>
        {/* Fecha de Evaluación */}
        <Typography variant="h6">Fecha de Evaluación</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Fecha y Hora"
            value={formik.values.date}
            onChange={(value: Date | null) => formik.setFieldValue('date', value)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />
        </LocalizationProvider>

         {/* Información del Socio */}
         <Typography variant="h6">Información del Socio</Typography>
        <Divider />
        <TextField
          fullWidth
          label="Nombre del Socio"
          name="clientName"
          margin="normal"
          {...formik.getFieldProps('clientName')}
        />
        <TextField
          fullWidth
          label="Edad"
          name="age"
          margin="normal"
          type="number"
          {...formik.getFieldProps('age')}
        />

        {/* Información de Salud */}
        <Typography variant="h6">Información de Salud</Typography>
        <Divider />
        <TextField fullWidth label="Lesiones" margin="normal" {...formik.getFieldProps('injuries')} />
        <TextField fullWidth label="Otros" name="otherHealthInfo" margin="normal" {...formik.getFieldProps('otherHealthInfo')} />
        <TextField fullWidth label="Medicamentos" name="medications" margin="normal" {...formik.getFieldProps('medications')} />

        {/* Información Deportiva */}
        <Typography variant="h6">Información Deportiva</Typography>
        <Divider />
        <FormControlLabel
          control={<Checkbox {...formik.getFieldProps('currentlyExercising')} />}
          label="Ejercita Actualmente"
        />
        <TextField fullWidth label="Deporte Practicado" name="sportsPracticed" margin="normal" {...formik.getFieldProps('sportsPracticed')} />

        {/* Información IMC */}
        <Typography variant="h6">Información IMC</Typography>
        <Divider />
        <TextField fullWidth label="Peso Actual (kg)" name="weight" margin="normal" {...formik.getFieldProps('weight')} />
        <TextField fullWidth label="IMC" name="bmi" margin="normal" {...formik.getFieldProps('bmi')} />

        {/* Información Perímetros Corporales */}
        <Typography variant="h6">Información Perímetros Corporales</Typography>
        <Divider />
        <TextField fullWidth label="Brazo Relajado" name="relaxedArm" margin="normal" {...formik.getFieldProps('relaxedArm')} />
        <TextField fullWidth label="Cintura (mínimo)" name="waist" margin="normal" {...formik.getFieldProps('waist')} />
        <TextField fullWidth label="Muslo Medio" name="midThigh" margin="normal" {...formik.getFieldProps('midThigh')} />
        <TextField fullWidth label="Brazo Contraído" name="flexedArm" margin="normal" {...formik.getFieldProps('flexedArm')} />
        <TextField fullWidth label="Cadera (máximo)" name="hips" margin="normal" {...formik.getFieldProps('hips')} />
        <TextField fullWidth label="Pantorrilla" name="calf" margin="normal" {...formik.getFieldProps('calf')} />

        {/* Información Perfil Antropométrico */}
        <Typography variant="h6">Información Perfil Antropométrico</Typography>
        <Divider />
        <TextField fullWidth label="Tricipital" name="tricepFold" margin="normal" {...formik.getFieldProps('tricepFold')} />
        <TextField fullWidth label="Subescapular" name="subscapularFold" margin="normal" {...formik.getFieldProps('subscapularFold')} />
        <TextField fullWidth label="Bicipital" name="bicepFold" margin="normal" {...formik.getFieldProps('bicepFold')} />
        <TextField fullWidth label="Supracrestideo" name="suprailiacFold" margin="normal" {...formik.getFieldProps('suprailiacFold')} />

        {/* Información de Interpretación */}
        <Typography variant="h6">Información de Interpretación de Datos</Typography>
        <Divider />
        <TextField fullWidth label="Suma de Pliegues" name="sumOfFolds" margin="normal" {...formik.getFieldProps('sumOfFolds')} />
        <TextField fullWidth label="% de Pliegues" name="percentageOfFolds" margin="normal" {...formik.getFieldProps('percentageOfFolds')} />
        <TextField fullWidth label="Masa Adiposa (kg)" name="fatMass" margin="normal" {...formik.getFieldProps('fatMass')} />
        <TextField fullWidth label="Masa Libre de Grasa (kg)" name="leanMass" margin="normal" {...formik.getFieldProps('leanMass')} />
        <TextField fullWidth label="Masa Muscular (kg)" name="muscleMass" margin="normal" {...formik.getFieldProps('muscleMass')} />

        {/* Peso Ideal */}
        <Typography variant="h6">Peso Ideal</Typography>
        <Divider />
        <TextField fullWidth label="Peso Ideal Mínimo" name="idealMinWeight" margin="normal" {...formik.getFieldProps('idealMinWeight')} />
        <TextField fullWidth label="Peso Ideal Máximo" name="idealMaxWeight" margin="normal" {...formik.getFieldProps('idealMaxWeight')} />
        <TextField fullWidth label="Recomendaciones para el Entrenador" name="trainerRecommendations" margin="normal" {...formik.getFieldProps('trainerRecommendations')} />

        {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}
        {submitSuccess && <Alert severity="success" sx={{ mt: 2 }}>Medición añadida con éxito</Alert>}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddMeasurementForm;
