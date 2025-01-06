import React from 'react';
import { useAuth } from '../../../Auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { menuItems } from '../../../config/menuItems';
import { getPrimaryRole } from '../../../Helpers/getPrimaryRole'

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const userRoles = login.roles || [];
  const primaryRole = getPrimaryRole(userRoles);
  console.log("[Sidebar] Roles del usuario:", userRoles);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
  {menuItems
    .filter((item) => {
      console.log("[Sidebar] Rol principal:", primaryRole);
console.log("[Sidebar] Elementos del menú visibles:", menuItems.filter((item) => item.roles.includes(primaryRole)));

      return item.roles.includes(primaryRole);
    })
    .map((item) => (
      <ListItem key={item.label} disablePadding>
        <ListItemButton onClick={() => navigate(item.path)}>
          <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    ))}
</List>

    </Drawer>
  );
};

export default Sidebar;
