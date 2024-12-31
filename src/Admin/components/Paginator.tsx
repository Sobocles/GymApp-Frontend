import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

interface PaginatorProps {
  url: string; // Prefijo de la URL base
  paginator: {
    number: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

export const Paginator = ({ url, paginator }: PaginatorProps) => {

  if (paginator.totalPages <= 1) return null;

  const { number, totalPages, first, last } = paginator;
  console.log("datos de paginacion",number, totalPages, first, last);
  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: '10px 0',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ul className="pagination" style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
        {!first && (
          <li className="page-item">
            <Link className="page-link" to={`${url}?page=${Math.max(0, number - 1)}`}>
              Anterior
            </Link>
          </li>
        )}

        {Array.from(Array(totalPages).keys()).map((page) => (
          <li
            key={page}
            className={`page-item ${number === page ? 'active' : ''}`}
            style={{ margin: '0 5px' }}
          >
<Link className="page-link" to={`${url}/page/${page}`}>
  {page + 1}
</Link>

          </li>
        ))}

        {!last && (
          <li className="page-item">
            <Link className="page-link" to={`${url}?page=${number + 1}`}>
              Siguiente
            </Link>
          </li>
        )}
      </ul>
    </Box>
  );
};
