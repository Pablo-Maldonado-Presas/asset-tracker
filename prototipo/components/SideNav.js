import React, { useState } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  Paper, 
  Divider, 
  Box, 
  Menu, 
  MenuItem 
} from '@mui/material';
import { 
  ExpandLess, 
  ExpandMore, 
  BarChart, 
  Settings,
  TrackChanges,
  ManageAccounts, 
  Dns, 
  HelpOutline, 
  AccountCircle 
} from '@mui/icons-material';

// Elementos del menú
const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <BarChart />,
  },
  {
    title: 'Administración',
    icon: <Settings />,
    subItems: [
      { href: '/admin-pallets', text: 'Pallets' },
      { href: '/admin-etiquetas', text: 'Etiquetas' },
      { href: '/admin-sensores', text: 'Sensores' },
      { href: '/admin-antenas', text: 'Antenas' },
    ],
  },
  {
    title: 'Trazabilidad',
    href: '/panel-trazabilidad',
    icon: <TrackChanges />,
  },
  {
    title: 'Gestión de Usuarios',
    href: '/gestion-usuarios',
    icon: <ManageAccounts />,
  },
  {
    title: 'Historial de Transacciones',
    href: '/historial-transacciones',
    icon: <Dns />,
  },
  {
    title: 'Ayuda',
    icon: <HelpOutline />,
    subItems: [
      { href: '/manual-usuario', text: 'Manual' },
      { href: '/soporte', text: 'Soporte' },
      { href: '/FAQ', text: 'FAQ' },
    ],
  },
];

// Estilos para el menú
const FireNav = styled(List)(({ theme }) => ({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
  '& .MuiListItemButton-root.selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const SideNav = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);

  const toggleMenu = (title) => {
    setOpenMenus((prevOpenMenus) => ({
      ...prevOpenMenus,
      [title]: !prevOpenMenus[title],
    }));
  };

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuLogout = () => {
    setAnchorEl(null);
    window.location.href = '/';
  };

  const handleItemClick = (href) => {
    setSelected(href);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: 'dark', // Puedes cambiar a 'light' si prefieres un tema claro
            primary: { main: 'rgb(102, 157, 246)' },
            background: { paper: 'rgb(28,116,212)' },
            action: {
              hover: 'rgba(255, 255, 255, 0.1)', // Color de hover
            },
          },
        })}
      >
        <Paper elevation={0} sx={{ maxWidth: 256, borderRadius: 0, flexGrow: 1 }}>
          <FireNav component="nav" disablePadding>
            <ListItemButton component="a" href="" aria-label="Ir al inicio">
              <ListItemIcon>
                <img src="/logo.png" alt="Logo" style={{ width: 30, height: 30 }} />
              </ListItemIcon>
              <ListItemText
                sx={{ my: 0, paddingLeft: 1 }}
                primary="Asset Tracker"
                slotProps={{
                  primary: {
                    fontSize: 20,
                    fontWeight: 'medium',
                    letterSpacing: 0,
                  },
                }}
              />
            </ListItemButton>
            <Divider />
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.subItems ? (
                  <>
                    <ListItemButton
                      onClick={() => toggleMenu(item.title)}
                      aria-label={`Abrir submenú de ${item.title}`}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.title} />
                      {openMenus[item.title] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openMenus[item.title]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subItems.map((subItem, subIndex) => (
                          <ListItemButton
                            key={subIndex}
                            component="a"
                            href={subItem.href}
                            sx={{ pl: 4 }}
                            selected={selected === subItem.href}
                            onClick={() => handleItemClick(subItem.href)}
                            aria-label={`Ir a ${subItem.text}`}
                          >
                            <ListItemText primary={subItem.text} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton
                    component="a"
                    href={item.href}
                    selected={selected === item.href}
                    onClick={() => handleItemClick(item.href)}
                    aria-label={`Ir a ${item.title}`}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                )}
              </React.Fragment>
            ))}
          </FireNav>
        </Paper>

        {/* Menú de usuario */}
        <Box sx={{ p: 2, backgroundColor: 'rgb(28,116,212)' }}>
          <ListItemButton
            onClick={handleUserMenuClick}
            sx={{ backgroundColor: 'rgb(28,116,212)' }}
            aria-label="Abrir menú de usuario"
          >
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Usuario" />
          </ListItemButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={handleUserMenuClose}>Mi Cuenta</MenuItem>
            <MenuItem onClick={handleUserMenuLogout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Box>
      </ThemeProvider>
    </Box>
  );
};

export default SideNav;