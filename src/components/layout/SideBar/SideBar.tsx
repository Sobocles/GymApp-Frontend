// src/components/layout/SideBar/SideBar.tsx

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

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const userRoles = login.roles || [];
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
        {menuItems.map((item) => {
          const hasPermission = item.roles.some((role) => userRoles.includes(role));

          if (!hasPermission) {
            return null;
          }

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
