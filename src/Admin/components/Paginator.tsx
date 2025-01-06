import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

interface PaginatorProps {
  url: string; // URL base, p.ej. "/store"
  paginator: {
    number: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
  sortBy: string; // <-- nueva prop
}

export const Paginator = ({ url, paginator, sortBy }: PaginatorProps) => {
  console.log("PAGINATOR",url, paginator, sortBy);

  const { number, totalPages, first, last } = paginator;

  console.log("PAGINATOR",number, totalPages, first, last);

  if (totalPages <= 1) return null;

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
        
        {/* Botón Anterior */}
        {!first && (
          <li className="page-item" style={{ margin: '0 5px' }}>
            <Link
              className="page-link"
              to={`${url}/page/${Math.max(0, number - 1)}?sortBy=${sortBy}`}
            >
              Anterior
            </Link>
          </li>
        )}

        {/* Números de página */}
        {Array.from(Array(totalPages).keys()).map((pageIndex) => (
          <li
            key={pageIndex}
            className={`page-item ${number === pageIndex ? 'active' : ''}`}
            style={{ margin: '0 5px' }}
          >
            <Link
              className="page-link"
              to={`${url}/page/${pageIndex}?sortBy=${sortBy}`}>
        
              {pageIndex + 1}
            </Link>
          </li>
        ))}

        {/* Botón Siguiente */}
        {!last && (
          <li className="page-item" style={{ margin: '0 5px' }}>
            <Link
              className="page-link"
              to={`${url}/page/${number + 1}?sortBy=${sortBy}`}
            >
              Siguiente
            </Link>
          </li>
        )}
      </ul>
    </Box>
  );
};
