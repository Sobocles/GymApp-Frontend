import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Box, Grid, TextField, Typography, Slider } from '@mui/material';

import { useSearch } from '../../Admin/hooks/useSearch';
import { Product } from '../interface/Product';
import { getProductsPage, getProductsBySearch } from '../../Store/services/ProductService';
import { Paginator } from '../../Admin/components/Paginator';

interface PaginatorState {
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

const StoreHomePage: React.FC = () => {
  // Tomar el searchTerm de un hook reutilizable
  const { searchTerm, setSearchTerm } = useSearch();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  // Leer la página desde la URL (/store/page/:page)
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

  // Saber si estamos "buscando" (es decir, si searchTerm no está vacío)
  const isSearching = searchTerm.trim() !== '';

  // Efecto principal: cuando cambia page, category o searchTerm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('Buscando con term=', searchTerm);
        if (isSearching) {
          // Llamada al backend que devuelve una lista sin paginación
          const foundProducts = await getProductsBySearch(searchTerm);
          console.log('foundProducts:', foundProducts);
          setProducts(foundProducts);

          setPaginator({
            totalPages: 0,
            number: 0,
            first: true,
            last: true,
          });
        } else {
          // 2. Si NO hay búsqueda, usar la paginación normal
          const response = await getProductsPage(pageNumber, 12, category || undefined);
          console.log("paginacion normal",response )
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

  // Filtro de precio (local)
  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  // Aplicar el filtro local de precios sobre los productos recibidos
  const finalProducts = products.filter((p) => {
    return p.price >= priceRange[0] && p.price <= priceRange[1];
  });

  return (
    <Box display="flex" padding={2}>
      {/* Panel Izquierdo: Filtro de precio */}
      <Box width="20%" paddingRight={2}>
        <Typography variant="h6" gutterBottom>
          Filtrar por precio (USD)
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2">
          Rango: ${priceRange[0]} - ${priceRange[1]}
        </Typography>
      </Box>

      {/* Panel Derecho */}
      <Box flex={1}>
        <Typography variant="h4" gutterBottom>
          {category ? `Productos de ${category}` : 'Todos los Productos'}
        </Typography>

        {/* Barra de búsqueda */}
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
        ) : finalProducts.length === 0 ? (
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
                    border: 'none',  // Elimina el borde
                    boxShadow: 'none',  // Quita cualquier sombra
                    overflow: 'hidden',  // Asegúrate de que el contenido que sobresale no se muestre
                    borderRadius: '4px',  // Opcional: para bordes redondeados
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
                  <Typography variant="body1">
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Mostrar paginador SÓLO si no hay búsqueda y hay más de 1 página */}
        {!isSearching && paginator.totalPages > 1 && (
          <Paginator
            url="/store"
            paginator={{
              number: paginator.number,
              totalPages: paginator.totalPages,
              first: paginator.first,
              last: paginator.last,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default StoreHomePage;
