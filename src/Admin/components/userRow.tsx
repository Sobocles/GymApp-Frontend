// src/Admin/components/UserRow.tsx
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../../Auth/hooks/useAuth";
import { UserInterface } from '../../Auth/Interfaces/UserInterface';

import { TableRow, TableCell, Button, Avatar } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

export const UserRow = ({ id, username, email, admin, profileImageUrl }: UserInterface) => {

    const { handlerUserSelectedForm, handlerRemoveUser } = useUsers();
    const { login } = useAuth();

    return (
        <TableRow>
              <TableCell>
                <Avatar 
                alt={username} 
                src={profileImageUrl} 
                sx={{ width: 60, height: 60 }}
                />
            </TableCell>
            <TableCell>{id}</TableCell>
            <TableCell>{username}</TableCell>
            <TableCell>{email}</TableCell>

            {login.isAdmin && (
                <>
                    <TableCell>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => handlerUserSelectedForm({
                                id,
                                username,
                                email,
                                admin,
                                profileImageUrl
                            })}
                        >
                            Update
                        </Button>
                    </TableCell>
                    <TableCell>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            component={RouterLink}
                            to={'/users/edit/' + id}
                        >
                            Update Route
                        </Button>
                    </TableCell>
                    <TableCell>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => id && handlerRemoveUser(id)}
                        >
                            Remove
                        </Button>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
};
