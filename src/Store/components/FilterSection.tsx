import React from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const FilterSection: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" gutterBottom>
        Filtros
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Disponibilidad</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column">
            <FormControlLabel
              control={<Checkbox name="inStock" />}
              label="En existencia"
            />
            <FormControlLabel
              control={<Checkbox name="outOfStock" />}
              label="Agotado"
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Marca</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Selecciona una marca</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Sabor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Selecciona un sabor</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSection;
