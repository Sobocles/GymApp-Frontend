import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';



import { useSearch } from '../../Admin/hooks/useSearch';
import { Product } from '../interface/Product';
import { getProductsPage, getProductsBySearch} from '../../Store/services/ProductService';
import { Paginator } from '../../Admin/components/Paginator';
import FilterSection from '../components/FilterSection';


interface PaginatorState {
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

const StoreHomePage: React.FC = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  const { page } = useParams();
  const pageNumber = page ? parseInt(page, 10) : 0;

  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [products, setProducts] = useState<Product[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    totalPages: 0,
    number: 0,
    first: true,
    last: false,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('price_asc');  // Estado para el dropdown

  const isSearching = searchTerm.trim() !== '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (isSearching) {
          const foundProducts = await getProductsBySearch(searchTerm);
          console.log(foundProducts);
          setProducts(foundProducts);
          setPaginator({
            totalPages: 0,
            number: 0,
            first: true,
            last: true,
          });
        } else {
          const response = await getProductsPage(pageNumber, 12, category, sortBy);
          console.log(response);
          setProducts(response.content);
          setPaginator({
            totalPages: response.totalPages,
            number: response.number,
            first: response.first,
            last: response.last,
          });
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isSearching, searchTerm, category, pageNumber]);

  // Nueva función para manejar el ordenamiento
 // StoreHomePage.tsx (fragmento)
const handleSortChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
  const newSort = event.target.value as string;
  setSortBy(newSort); // Actualizamos el estado

  try {
    setLoading(true);
    // aquí utilizamos newSort en lugar de sortBy
    const response = await getProductsPage(pageNumber, 12, category, newSort);
    setProducts(response.content);
    setPaginator({
      totalPages: response.totalPages,
      number: response.number,
      first: response.first,
      last: response.last,
    });
  } catch (error) {
    console.error('Error al ordenar productos:', error);
  } finally {
    setLoading(false);
  }
};

  

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    console.log("nuevo valor",newValue);
    setPriceRange(newValue as number[]);
  };

  const finalProducts = products.filter((p) => {
    return p.price >= priceRange[0] && p.price <= priceRange[1];
  });

  return (
    <Box display="flex" padding={2}>
          <Box width="20%" paddingRight={2}>
            < FilterSection />
          </Box>

      <Box flex={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" position="relative">
  <Typography variant="h4" gutterBottom>
    {category ? `Productos de ${category}` : 'Todos los Productos'}
  </Typography>

  {/* Contenedor para el dropdown con margen hacia la derecha */}
  <Box sx={{ position: 'absolute', right: '120px', top: '50px' }}>
    <FormControl sx={{ minWidth: 200 }} size="small">
      <InputLabel id="sort-select-label">Ordenar</InputLabel>
      <Select
        labelId="sort-select-label"
        value={sortBy}
        onChange={handleSortChange}
      >
        <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
        <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
        <MenuItem value="best_selling">Más Vendidos</MenuItem>
      </Select>
    </FormControl>
  </Box>
</Box>


        <Box mb={4}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            label="Buscar"
            sx={{ maxWidth: '300px' }}
          />
        </Box>
        {loading ? (
  <Typography variant="body1">Cargando productos...</Typography>
) : !finalProducts || finalProducts.length === 0 ? (
  <Typography variant="body1">No se encontraron productos.</Typography>
) : (
  <Grid container spacing={2}>
    {finalProducts.map((product) => (
      <Grid item xs={12} sm={6} md={3} key={product.id}>
        <Box
          component={Link}
          to={`/store/product/${product.id}`}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            border: 'none',
            boxShadow: 'none',
            overflow: 'hidden',
            borderRadius: '4px',
            padding: 2,
            textAlign: 'center',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.03)',
              cursor: 'pointer',
            },
          }}
        >
          {product.imageUrl && (
            <Box
              sx={{
                width: '100%',
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '8px',
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: 'auto',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="body1">${product.price.toFixed(2)}</Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
)}

        {!isSearching && paginator.totalPages > 1 && (
         <Paginator
         url="/store" 
         paginator={{
           number: paginator.number,
           totalPages: paginator.totalPages,
           first: paginator.first,
           last: paginator.last,
         }}
         sortBy={sortBy}
       />
       
       
        
        )}

      </Box>
    </Box>
  );
};

export default StoreHomePage;
