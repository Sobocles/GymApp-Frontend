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

  brands: string[]; 
  flavors: string[];              // <-- Ahora recibimos flavors dinámicos
}

const FilterSection: React.FC<FilterSectionProps> = ({
  checkBoxInStock,
  setCheckBoxInStock,
  selectedBrands,
  setSelectedBrands,
  selectedFlavors,
  setSelectedFlavors,
  brands,
  flavors, 
}) => {

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxInStock(e.target.checked);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]
    );
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" gutterBottom>
        Filtros
      </Typography>

      {/* Disponibilidad */}
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

      {/* Marcas */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Marca</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
              }
              label={brand}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Sabores (Dinámicos) */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Sabor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {flavors.length === 0 ? (
            <Typography variant="body2">
              No hay sabores registrados.
            </Typography>
          ) : (
            flavors.map((flavor) => (
              <FormControlLabel
                key={flavor}
                control={
                  <Checkbox
                    checked={selectedFlavors.includes(flavor)}
                    onChange={() => handleFlavorToggle(flavor)}
                  />
                }
                label={flavor}
              />
            ))
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSection;
