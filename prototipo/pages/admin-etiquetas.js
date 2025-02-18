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

const BODEGAS = ['Bodega Central', 'Bodega Norte', 'Bodega Sur', 'Bodega Este', 'Bodega Oeste'];
const UBICACIONES = ['Estante 1', 'Estante 2', 'Estante 3', 'Estante 4', 'Estante 5'];
const ESTADOS_ETIQUETA = ['Activo', 'Inactivo'];

const FormularioEtiqueta = ({ formulario, onChange, onSubmit, operacionActual }) => (
  <div style={{ marginBottom: '20px' }}>
    <TextField
      label='Código'
      name='codigo'
      variant='outlined'
      value={formulario.codigo}
      onChange={onChange}
      disabled={operacionActual === 'editar'}
      style={{ marginRight: '10px' }}
    />
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
    <Select
      name='ubicacion'
      value={formulario.ubicacion}
      onChange={onChange}
      style={{ marginRight: '10px', minWidth: 120 }}
      displayEmpty
    >
      <MenuItem value='' disabled>
        Ubicación
      </MenuItem>
      {UBICACIONES.map((ubicacion) => (
        <MenuItem key={ubicacion} value={ubicacion}>
          {ubicacion}
        </MenuItem>
      ))}
    </Select>
    <TextField
      label='Pallet'
      name='pallet'
      variant='outlined'
      value={formulario.pallet}
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
      {ESTADOS_ETIQUETA.map((estado) => (
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

const AdminEtiquetas = () => {
  const [etiquetas, setEtiquetas] = useState([]);
  const [formulario, setFormulario] = useState({
    codigo: '',
    bodega: '',
    ubicacion: '',
    pallet: '',
    fabricante: '',
    modelo: '',
    frecuencia: '',
    estado: ''
  });
  const [operacionActual, setOperacionActual] = useState('registrar');
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState(null);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [dialogoDetalles, setDialogoDetalles] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setEtiquetas([
      {
        id: 1,
        codigo: 'ETQ123',
        bodega: 'Bodega Central',
        ubicacion: 'Estante 1',
        fabricante: 'Fabricante A',
        modelo: 'Modelo X',
        frecuencia: '40 KHz',
        fecha_registro: '01-12-2024',
        fecha_ultima_lectura: '10-12-2024 12:04:22',
        pallet: 'PAL123',
        estado: 'Activo'

      },
      {
        id: 2,
        codigo: 'ETQ456',
        bodega: 'Bodega Norte',
        ubicacion: 'Estante 2',
        fabricante: 'Fabricante B',
        modelo: 'Modelo Y',
        frecuencia: '40 KHz',
        fecha_registro: '01-12-2024',
        fecha_ultima_lectura: '11-12-2024 16:51:55',
        pallet: 'PAL456',
        estado: 'Activo',
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
    const requiredFields = ['codigo', 'bodega', 'ubicacion', 'pallet', 'estado'];
    for (const field of requiredFields) {
      if (!formulario[field]) {
        mostrarSnackbar('Datos inválidos: Complete todos los campos.', 'error');
        return false;
      }
    }
    if (
      etiquetas.some(
        (etq) => etq.codigo === formulario.codigo && etq.id !== etiquetaSeleccionada?.id
      )
    ) {
      mostrarSnackbar('Error: Etiqueta ya registrada.', 'error');
      return false;
    }
    return true;
  };

  const handleRegistrar = () => {
    if (!validarFormulario()) return;

    const nuevaEtiqueta = {
      id: etiquetas.length + 1,
      ...formulario,
    };

    setEtiquetas([...etiquetas, nuevaEtiqueta]);
    setFormulario({
      codigo: '',
      bodega: '',
      ubicacion: '',
      pallet: '',
      fabricante: '',
      modelo: '',
      frecuencia: '',
      estado: ''
    });
    mostrarSnackbar('Etiqueta registrada con éxito.', 'success');
  };

  const handleEditar = () => {
    if (!validarFormulario()) return;

    setEtiquetas(
      etiquetas.map((etq) =>
        etq.id === etiquetaSeleccionada.id ? { ...etq, ...formulario } : etq
      )
    );
    setEtiquetaSeleccionada(null);
    setFormulario({
      codigo: '',
      bodega: '',
      ubicacion: '',
      pallet: '',
      estado: ''
    });
    setOperacionActual('registrar');
    mostrarSnackbar('Etiqueta actualizada con éxito.', 'success');
  };

  const handleEliminar = () => {
    setEtiquetas(etiquetas.filter((etq) => etq.id !== etiquetaSeleccionada.id));
    setEtiquetaSeleccionada(null);
    setDialogoEliminar(false);
    mostrarSnackbar('Etiqueta eliminada con éxito.', 'success');
  };

  const handleCerrarSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSeleccionarEtiqueta = (etiqueta) => {
    setEtiquetaSeleccionada(etiqueta);
    setFormulario(etiqueta);
    setOperacionActual('editar');
  };

  const handleVerDetalles = (etiqueta) => {
    setEtiquetaSeleccionada(etiqueta);
    setDialogoDetalles(true);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Gestión de Etiquetas</h1>

        <FormularioEtiqueta
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
                <TableCell>Bodega</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Pallet</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {etiquetas.map((etiqueta) => (
                <TableRow key={etiqueta.id}>
                  <TableCell>{etiqueta.codigo}</TableCell>
                  <TableCell>{etiqueta.bodega}</TableCell>
                  <TableCell>{etiqueta.ubicacion}</TableCell>
                  <TableCell>{etiqueta.pallet}</TableCell>
                  <TableCell>{etiqueta.estado}</TableCell>

                  <TableCell>
                    <Button
                      variant='text'
                      color='primary'
                      onClick={() => handleSeleccionarEtiqueta(etiqueta)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant='text'
                      color='secondary'
                      onClick={() => {
                        setEtiquetaSeleccionada(etiqueta);
                        setDialogoEliminar(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='text'
                      color='primary'
                      onClick={() => handleVerDetalles(etiqueta)}
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
            ¿Está seguro de que desea eliminar la etiqueta '{etiquetaSeleccionada?.codigo}'?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogoEliminar(false)}>Cancelar</Button>
            <Button color='secondary' onClick={handleEliminar}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialogoDetalles} onClose={() => setDialogoDetalles(false)}>
          <DialogTitle>Detalles de la Etiqueta</DialogTitle>
          <DialogContent>
            {etiquetaSeleccionada && (
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>{etiquetaSeleccionada.codigo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bodega</TableCell>
                      <TableCell>{etiquetaSeleccionada.bodega}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>{etiquetaSeleccionada.ubicacion}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fabricante</TableCell>
                      <TableCell>{etiquetaSeleccionada.fabricante}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Modelo</TableCell>
                      <TableCell>{etiquetaSeleccionada.modelo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Frecuencia</TableCell>
                      <TableCell>{etiquetaSeleccionada.frecuencia}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fecha de registro</TableCell>
                      <TableCell>{etiquetaSeleccionada.fecha_registro}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Última lectura</TableCell>
                      <TableCell>{etiquetaSeleccionada.fecha_ultima_lectura}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pallet</TableCell>
                      <TableCell>{etiquetaSeleccionada.pallet}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Estado</TableCell>
                      <TableCell>{etiquetaSeleccionada.estado}</TableCell>
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

export default AdminEtiquetas;