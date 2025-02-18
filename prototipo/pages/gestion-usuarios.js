import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  MenuItem,
  Select,
} from '@mui/material';
import SideNav from '../components/SideNav';

const BODEGAS = ['Bodega Central', 'Bodega Norte', 'Bodega Sur', 'Bodega Este', 'Bodega Oeste']
const ROLES = ['Administrador', 'Supervisor', 'Operador'];
const PERMISOS_POR_ROL = {
  Administrador: ['Gestión de usuarios', 'Gestión de inventario', 'Reportes'],
  Supervisor: ['Gestión de inventario', 'Reportes'],
  Operador: ['Consulta de inventario'],
};

const FormularioUsuario = ({ formulario, onChange, onSubmit, operacionActual }) => (
  <Box sx={{ marginBottom: '20px' }}>
    <TextField
      label='Nombre Completo'
      name='nombre'
      variant='outlined'
      value={formulario.nombre}
      onChange={onChange}
      sx={{ marginRight: '10px' }}
    />
    <TextField
      label='Correo Electrónico'
      name='correo'
      variant='outlined'
      value={formulario.correo}
      onChange={onChange}
      sx={{ marginRight: '10px' }}
    />
    <Select
      name='bodega'
      value={formulario.bodega}
      onChange={onChange}
      sx={{ marginRight: '10px', minWidth: 120 }}
      displayEmpty
    >
      <MenuItem value='' disabled>
        Bodega
      </MenuItem>
      {BODEGAS.map((bodega) => (
        <MenuItem key={bodega} value={bodega}>
          {bodega}
        </MenuItem>
      ))}
    </Select>
    <Select
      name='rol'
      value={formulario.rol}
      onChange={onChange}
      sx={{ marginRight: '10px', minWidth: 120 }}
      displayEmpty
    >
      <MenuItem value='' disabled>
        Rol
      </MenuItem> 
      {ROLES.map((rol) => (
        <MenuItem key={rol} value={rol}>
          {rol}
        </MenuItem>
      ))}
    </Select>
    <Button variant='contained' color='primary' onClick={onSubmit}>
      {operacionActual === 'registrar' ? 'Registrar' : 'Editar'}
    </Button>
  </Box>
);

const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: '', correo: '', bodega: '', rol: '' });
  const [operacionActual, setOperacionActual] = useState('registrar');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [dialogoDetalles, setDialogoDetalles] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setUsuarios([
      { id: 1, nombre: 'Juan Pérez', correo: 'juan.perez@example.com', bodega: 'Bodega Central', rol: 'Supervisor' },
      { id: 2, nombre: 'Ana Gómez', correo: 'ana.gomez@example.com', bodega: 'Bodega Norte', rol: 'Operador' },
      { id: 3, nombre: 'María López', correo: 'maria.lopez@example.com', bodega: 'Bodega Sur', rol: 'Administrador' },
    ]);
  }, []);

  const handleFormularioChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const validarFormulario = () => {
    if (!formulario.nombre || !formulario.correo || !formulario.bodega || !formulario.rol) {
      mostrarSnackbar('Datos inválidos: Complete todos los campos.', 'error');
      return false;
    }
    return true;
  };

  const handleRegistrar = () => {
    if (!validarFormulario()) return;
    const nuevoUsuario = { id: usuarios.length + 1, ...formulario };
    setUsuarios([...usuarios, nuevoUsuario]);
    setFormulario({ nombre: '', correo: '', bodega: '', rol: '' });
    mostrarSnackbar('Usuario registrado con éxito.', 'success');
  };

  const handleEditar = () => {
    if (!validarFormulario()) return;
    setUsuarios(
      usuarios.map((usr) => (usr.id === usuarioSeleccionado.id ? { ...usr, ...formulario } : usr))
    );
    setUsuarioSeleccionado(null);
    setFormulario({ nombre: '', correo: '', bodega: '', rol: '' });
    setOperacionActual('registrar');
    mostrarSnackbar('Usuario actualizado con éxito.', 'success');
  };

  const handleEliminar = () => {
    setUsuarios(usuarios.filter((usr) => usr.id !== usuarioSeleccionado.id));
    setUsuarioSeleccionado(null);
    setDialogoEliminar(false);
    mostrarSnackbar('Usuario eliminado con éxito.', 'success');
  };

  const handleVerDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setDialogoDetalles(true);
  };

  const permisosDelUsuario = (rol) => PERMISOS_POR_ROL[rol] || [];

  const usuariosPorRol = (rol) => usuarios.filter((usr) => usr.rol === rol);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <Box sx={{ flex: 1, padding: '20px', overflowY: 'auto', maxHeight: '100vh' }}>
        <h1>Gestión de Usuarios</h1>

        <FormularioUsuario
          formulario={formulario}
          onChange={handleFormularioChange}
          onSubmit={operacionActual === 'registrar' ? handleRegistrar : handleEditar}
          operacionActual={operacionActual}
        />

        {ROLES.map((rol) => (
          <Box key={rol} sx={{ marginBottom: '20px' }}>
            <h2>{rol}</h2>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre Completo</TableCell>
                    <TableCell>Correo Electrónico</TableCell>
                    <TableCell>Bodega</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuariosPorRol(rol).map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>{usuario.correo}</TableCell>
                      <TableCell>{usuario.bodega}</TableCell>
                      <TableCell>
                        <Button
                          variant='text'
                          color='primary'
                          onClick={() => {
                            setUsuarioSeleccionado(usuario);
                            setFormulario(usuario);
                            setOperacionActual('editar');
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant='text'
                          color='secondary'
                          onClick={() => {
                            setUsuarioSeleccionado(usuario);
                            setDialogoEliminar(true);
                          }}
                        >
                          Eliminar
                        </Button>
                        <Button variant='text' color='primary' onClick={() => handleVerDetalles(usuario)}>
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        <Dialog open={dialogoEliminar} onClose={() => setDialogoEliminar(false)}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            ¿Está seguro de que desea eliminar al usuario '{usuarioSeleccionado?.nombre}'?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogoEliminar(false)}>Cancelar</Button>
            <Button color='secondary' onClick={handleEliminar}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialogoDetalles} onClose={() => setDialogoDetalles(false)}>
          <DialogTitle>Detalles del Usuario</DialogTitle>
          <DialogContent>
            {usuarioSeleccionado && (
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Nombre Completo</TableCell>
                      <TableCell>{usuarioSeleccionado.nombre}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Correo Electrónico</TableCell>
                      <TableCell>{usuarioSeleccionado.correo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bodega</TableCell>
                      <TableCell>{usuarioSeleccionado.bodega}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Rol</TableCell>
                      <TableCell>{usuarioSeleccionado.rol}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Permisos</TableCell>
                      <TableCell>
                        <ul>
                          {permisosDelUsuario(usuarioSeleccionado.rol).map((permiso, index) => (
                            <li key={index}>{permiso}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AdminUsers;