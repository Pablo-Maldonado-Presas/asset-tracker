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
const TIPOS_ANTENA = ['Tipo A', 'Tipo B']
const ESTADOS_ANTENA = ['Activo', 'Inactivo'];

const FormularioAntena = ({ formulario, onChange, onSubmit, operacionActual }) => (
  <div style={{ marginBottom: '20px' }}>
    <TextField
      label='Código'
      name='codigo'
      variant='outlined'
      value={formulario.codigo}
      onChange={onChange}
      disabled={operacionActual == 'editar'}
      style={{ marginRight: '10px' }}
    />
    <Select
      name='tipo_antena'
      value={formulario.tipo_antena}
      onChange={onChange}
      disabled={operacionActual == 'editar'}
      style={{ marginRight: '10px', minWidth: 120 }}
      displayEmpty
    >
      <MenuItem value= '' disabled>
      Tipo
      </MenuItem>
      {TIPOS_ANTENA.map((tipo_antena) => (
        <MenuItem key={tipo_antena} value={tipo_antena}>
          {tipo_antena}
        </MenuItem>
      ))}
    </Select>
    <Select
      name='bodega'
      value={formulario.bodega}
      onChange={onChange}
      style={{ marginRight: '10px', minWidth: 120 }}
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
    <TextField
      label='Modelo'
      name='modelo'
      variant='outlined'
      value={formulario.modelo}
      onChange={onChange}
      style={{ marginRight: '10px' }}
    />
    <Select
      name='estado'
      value={formulario.estado}
      onChange={onChange}
      style={{ marginRight: '10px', minWidth: 120 }}
      displayEmpty
    >
      <MenuItem value='' disabled>
        Estado
      </MenuItem>
      {ESTADOS_ANTENA.map((estado) => (
        <MenuItem key={estado} value={estado}>
          {estado}
        </MenuItem>
      ))}
    </Select>

    <Button variant='contained' color='primary' onClick={onSubmit}>
      {operacionActual === 'registrar' ? 'Registrar' : 'Editar'}
    </Button>
  </div>
);

const AdminAntenas = () => {
  const [antenas, setAntenas] = useState([]);
  const [formulario, setFormulario] = useState({ codigo: '', tipo_antena: '', bodega: '', modelo: '', estado: '' });
  const [operacionActual, setOperacionActual] = useState('registrar');
  const [antenaSeleccionada, setAntenaSeleccionada] = useState(null);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [dialogoDetalles, setDialogoDetalles] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Simulación de cargar antenas desde la base de datos
    setAntenas([
      {
        id: 1,
        codigo: 'ANT123',
        tipo_antena: 'Tipo A',
        bodega: 'Bodega Norte',
        modelo: 'Modelo X',
        fabricante: 'Fabricante Z',
        potencia: '15 dBm',
        fecha_registro: '01-12-2024',
        fecha_instalacion: '01-12-2024',
        estado: 'Activo'
      },
      {
        id: 2,
        codigo: 'ANT456',
        tipo_antena: 'Tipo A',
        bodega: 'Bodega Central',
        modelo: 'Modelo Y',
        fabricante: 'Fabricante W',
        potencia: '10 dBm',
        fecha_registro: '01-12-2024',
        fecha_instalacion: '01-12-2024',
        estado: 'Inactivo'
      },
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
    if (!formulario.codigo || !formulario.tipo_antena || !formulario.bodega || !formulario.modelo || !formulario.estado) {
      mostrarSnackbar('Datos inválidos: Complete todos los campos.', 'error');
      return false;
    }
    if (
      antenas.some(
        (ant) => ant.codigo === formulario.codigo && ant.id !== antenaSeleccionada?.id
      )
    ) {
      mostrarSnackbar('Error: Antena ya registrada.', 'error');
      return false;
    }
    return true;
  };

  const handleRegistrar = () => {
    if (!validarFormulario()) return;

    const nuevaAntena = {
      id: antenas.length + 1,
      ...formulario,
    };

    setAntenas([...antenas, nuevaAntena]);
    setFormulario({ codigo: '', tipo_antena: '',bodega: '', modelo: '', estado: '' });
    mostrarSnackbar('Antena registrada con éxito.', 'success');
  };

  const handleEditar = () => {
    if (!validarFormulario()) return;

    setAntenas(
      antenas.map((ant) =>
        ant.id === antenaSeleccionada.id ? { ...ant, ...formulario } : ant
      )
    );
    setAntenaSeleccionada(null);
    setFormulario({ codigo: '', bodega: '', estado: '', modelo: '' });
    setOperacionActual('registrar');
    mostrarSnackbar('Antena actualizada con éxito.', 'success');
  };

  const handleEliminar = () => {
    setAntenas(antenas.filter((ant) => ant.id !== antenaSeleccionada.id));
    setAntenaSeleccionada(null);
    setDialogoEliminar(false);
    mostrarSnackbar('Antena eliminada con éxito.', 'success');
  };

  const handleCerrarSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSeleccionarAntena = (antena) => {
    setAntenaSeleccionada(antena);
    setFormulario(antena);
    setOperacionActual('editar');
  };

  const handleVerDetalles = (antena) => {
    setAntenaSeleccionada(antena);
    setDialogoDetalles(true);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Gestión de Antenas</h1>

        <FormularioAntena
          formulario={formulario}
          onChange={handleFormularioChange}
          onSubmit={operacionActual === 'registrar' ? handleRegistrar : handleEditar}
          operacionActual={operacionActual}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Bodega</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {antenas.map((antena) => (
                <TableRow key={antena.id}>
                  <TableCell>{antena.codigo}</TableCell>
                  <TableCell>{antena.tipo_antena}</TableCell>
                  <TableCell>{antena.bodega}</TableCell>
                  <TableCell>{antena.modelo}</TableCell>
                  <TableCell>{antena.estado}</TableCell>
                  <TableCell>
                    <Button
                      variant='text'
                      color='primary'
                      onClick={() => handleSeleccionarAntena(antena)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant='text'
                      color='secondary'
                      onClick={() => {
                        setAntenaSeleccionada(antena);
                        setDialogoEliminar(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  <Button
                    variant='text'
                    color='primary'
                    onClick={() => handleVerDetalles(antena)}
                  >
                    Ver Detalles
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogoEliminar} onClose={() => setDialogoEliminar(false)}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            ¿Está seguro de que desea eliminar la antena '{antenaSeleccionada?.codigo}'?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogoEliminar(false)}>Cancelar</Button>
            <Button color='secondary' onClick={handleEliminar}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialogoDetalles} onClose={() => setDialogoDetalles(false)}>
          <DialogTitle>Detalles de la Antena</DialogTitle>
          <DialogContent>
            {antenaSeleccionada && (
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>{antenaSeleccionada.codigo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>{antenaSeleccionada.tipo_antena}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bodega</TableCell>
                      <TableCell>{antenaSeleccionada.bodega}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fabricante</TableCell>
                      <TableCell>{antenaSeleccionada.fabricante}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Modelo</TableCell>
                      <TableCell>{antenaSeleccionada.modelo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Potencia</TableCell>
                      <TableCell>{antenaSeleccionada.potencia}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fecha de registro</TableCell>
                      <TableCell>{antenaSeleccionada.fecha_registro}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fecha de instalación</TableCell>
                      <TableCell>{antenaSeleccionada.fecha_instalacion}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Estado</TableCell>
                      <TableCell>{antenaSeleccionada.estado}</TableCell>
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
          onClose={handleCerrarSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCerrarSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AdminAntenas;