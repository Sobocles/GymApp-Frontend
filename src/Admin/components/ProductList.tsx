/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ProductCrud/components/ProductList.tsx

import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';
import { Product } from '../../Store/interface/Product';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductList: React.FC<Props> = ({ products, onEdit, onDelete }) => {
  return (
    <Table>
    <TableHead>
      <TableRow>
        <TableCell><strong>ID</strong></TableCell>
        <TableCell><strong>Nombre</strong></TableCell>
        <TableCell><strong>Descripción</strong></TableCell>
        <TableCell><strong>Categoría</strong></TableCell>
        <TableCell><strong>Precio</strong></TableCell>
        <TableCell><strong>Stock</strong></TableCell> {/* Nueva columna */}
        <TableCell><strong>Marca</strong></TableCell>
        <TableCell><strong>Sabor</strong></TableCell>
        <TableCell><strong>Imagen</strong></TableCell>
        <TableCell><strong>Acciones</strong></TableCell>
      </TableRow>
    </TableHead>


    <TableBody>
  {products.map((p) => (
    <TableRow key={p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.description}</TableCell>
      <TableCell>
        {typeof p.category === 'string'
          ? p.category
          : (p.category as any)?.name ?? 'Sin categoría'}
      </TableCell>
      <TableCell>{p.price}</TableCell>
      <TableCell>{p.stock}</TableCell> {/* Mostramos el stock aquí */}
      <TableCell>{p.brand || 'Sin marca'}</TableCell>
      <TableCell>{p.flavor || 'Sin sabor'}</TableCell>
      <TableCell>
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} width="50" />
        ) : (
          'Sin imagen'
        )}
      </TableCell>
      <TableCell>
        {p.discountPercent && p.discountPercent > 0 ? (
          <>
            <span style={{ textDecoration: 'line-through' }}>
              ${p.price}
            </span>{' '}
            <strong style={{ color: 'red' }}>
              ${p.price - (p.price * p.discountPercent / 100)}
            </strong>
            {p.discountReason && (
              <i style={{ color: 'red', marginLeft: 5 }}>
                {p.discountReason}
              </i>
            )}
          </>
        ) : (
          <>${p.price}</>
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onEdit(p)}
          sx={{ mr: 1 }}
        >
          Editar
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => onDelete(p.id!)}
        >
          Eliminar
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
    </Table>
  );
};
