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

interface FilterSectionProps {
  checkBoxInStock: boolean;
  setCheckBoxInStock: React.Dispatch<React.SetStateAction<boolean>>;
  
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  
  selectedFlavors: string[];
  setSelectedFlavors: React.Dispatch<React.SetStateAction<string[]>>;

  // Opcional, si manejas rango aquí
  priceRange?: number[];
  setPriceRange?: React.Dispatch<React.SetStateAction<number[]>>;

  brands: string[]; 
}

const FilterSection: React.FC<FilterSectionProps> = ({
  checkBoxInStock,
  setCheckBoxInStock,
  selectedBrands,
  setSelectedBrands,
  selectedFlavors,
  setSelectedFlavors,
  priceRange,
  setPriceRange,
  brands,
}) => {

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxInStock(e.target.checked);
  };

  // Ejemplo de cambio de marca
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Lo mismo con Sabor...
  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors(prev => {
      if (prev.includes(flavor)) {
        return prev.filter(f => f !== flavor);
      } else {
        return [...prev, flavor];
      }
    });
  };

  // ...
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
              control={
                <Checkbox 
                  name="inStock" 
                  checked={checkBoxInStock}
                  onChange={handleInStockChange}
                />
              }
              label="En existencia"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Marca</Typography>
  </AccordionSummary>
  <AccordionDetails>
    {brands.map((brand) => (
      <FormControlLabel
        key={brand}  // Usa la marca como clave única
        control={
          <Checkbox
            checked={selectedBrands.includes(brand)}  // Verifica si la marca está seleccionada
            onChange={() => handleBrandToggle(brand)}  // Cambia la selección al hacer clic
          />
        }
        label={brand}  // Muestra el nombre de la marca
      />
    ))}
  </AccordionDetails>
</Accordion>


      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Sabor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Igualmente, un array de sabores */}
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFlavors.includes('Chocolate')}
                onChange={() => handleFlavorToggle('Chocolate')}
              />
            }
            label="Chocolate"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFlavors.includes('Vainilla')}
                onChange={() => handleFlavorToggle('Vainilla')}
              />
            }
            label="Vainilla"
          />
          {/* ... */}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSection;
