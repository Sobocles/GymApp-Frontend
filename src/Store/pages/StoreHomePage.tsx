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
import { advancedSearchProducts, getDistinctBrands, getProductsBySearch } from '../../Store/services/ProductService'; 
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

  // Page actual en la ruta
  const { page } = useParams();
  const pageNumber = page ? parseInt(page, 10) : 0;

  // Estados para paginación
  const [products, setProducts] = useState<Product[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    totalPages: 0,
    number: 0,
    first: true,
    last: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Estado para "sortBy"
  const [sortBy, setSortBy] = useState<string>('price_asc');

  // Estados para los filtros
  const [checkBoxInStock, setCheckBoxInStock] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [brands, setBrands] = useState<string[]>([]);

  const isSearching = searchTerm.trim() !== '';

  // Cargar productos (o hacer search)
  useEffect(() => {
    const fetchProductsAndBrands = async () => {
      setLoading(true);
      try {
        // Cargar productos
        if (isSearching) {
          const foundProducts = await getProductsBySearch(searchTerm);
          setProducts(foundProducts);
          setPaginator({ totalPages: 0, number: 0, first: true, last: true });
        } else {
          const filters = {
            category: category || null,
            inStock: checkBoxInStock ? true : undefined,
            brands: selectedBrands,
            flavors: selectedFlavors,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
          };
  
          const response = await advancedSearchProducts({
            page: pageNumber,
            size: 12,
            sortBy,
            ...filters,
          });
  
          setProducts(response.content);
          setPaginator({
            totalPages: response.totalPages,
            number: response.number,
            first: response.first,
            last: response.last,
          });
        }
  
        // Cargar marcas distintas
        const brandsResponse = await getDistinctBrands();
        console.log("Marcas obtenidas desde el backend:", brandsResponse);
        setBrands(brandsResponse);
        
      } catch (error) {
        console.error('Error al cargar productos o marcas:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductsAndBrands();
  }, [
    isSearching,
    searchTerm,
    category,
    pageNumber,
    sortBy,
    checkBoxInStock,
    selectedBrands,
    selectedFlavors,
    priceRange,
  ]);
  

  // Manejar ordenamiento
  const handleSortChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSort = event.target.value as string;
    console.log("ewSort",newSort)
    setSortBy(newSort);
  };

  // Si usas slider de precio:
  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  // Filtrado adicional en front (si lo deseas)
  const finalProducts = products.filter((p) => {
    return p.price >= priceRange[0] && p.price <= priceRange[1];
  });

  return (
    <Box display="flex" padding={2}>
      <Box width="20%" paddingRight={2}>
        <FilterSection
          checkBoxInStock={checkBoxInStock}
          setCheckBoxInStock={setCheckBoxInStock}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedFlavors={selectedFlavors}
          setSelectedFlavors={setSelectedFlavors}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          brands={brands} 
        />
      </Box>

      <Box flex={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" position="relative">
          <Typography variant="h4" gutterBottom>
            {category ? `Productos de ${category}` : 'Todos los Productos'}
          </Typography>

          {/* Dropdown de ordenamiento */}
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
