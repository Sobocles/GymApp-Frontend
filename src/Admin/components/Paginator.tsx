import React from 'react';
import { Link } from 'react-router-dom';

interface PaginatorProps {
  url: string;
  paginator: {
    number: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

export const Paginator = ({ url, paginator }: PaginatorProps) => {
  if (paginator.totalPages === 0) return null;

  return (
    <ul className="pagination">
      {!paginator.first && (
        <li className="page-item">
          <Link className="page-link" to={`${url}/${paginator.number - 1}`}>
            Anterior
          </Link>
        </li>
      )}

      {Array.from(Array(paginator.totalPages).keys()).map((page) => (
        <li
          key={page}
          className={`page-item ${paginator.number === page ? 'active' : ''}`}
        >
          <Link className="page-link" to={`${url}/${page}`}>
            {page + 1}
          </Link>
        </li>
      ))}

      {!paginator.last && (
        <li className="page-item">
          <Link className="page-link" to={`${url}/${paginator.number + 1}`}>
            Siguiente
          </Link>
        </li>
      )}
    </ul>
  );
};
