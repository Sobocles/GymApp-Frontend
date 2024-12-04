import React from 'react';
import { UserRow } from "./userRow";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../../Auth/hooks/useAuth";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

export const UsersList = () => {
  const { users } = useUsers();
  const { login } = useAuth();

  return (
    <Table>
      <TableHead>
        <TableRow>
        <TableCell>Imagen</TableCell>
          <TableCell>#</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Email</TableCell>
          {login.isAdmin && (
            <>
              <TableCell>Update</TableCell>
              <TableCell>Remove</TableCell>
            </>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <UserRow
            
            key={user.id}
            profileImageUrl={user.profileImageUrl}
            id={user.id}
            username={user.username}
            email={user.email}
            admin={user.admin} trainer={false} roles={[]}          />
        ))}
      </TableBody>
    </Table>
  );
};
