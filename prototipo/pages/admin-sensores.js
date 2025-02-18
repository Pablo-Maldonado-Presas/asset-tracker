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
const TIPOS_SENSOR = ['Tipo A', 'Tipo B', 'Tipo C']
const ESTADOS_SENSOR = ['Activo', 'Inactivo'];

const FormularioSensor = ({ formulario, onChange, onSubmit, operacionActual }) => (
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
      name='tipo_sensor'
      value={formulario.tipo_sensor}
      onChange={onChange}
      disabled={operacionActual == 'editar'}
      style={{ marginRight: '10px', minWidth: 120 }}
      displayEmpty
    >
      <MenuItem value= '' disabled>
        Tipo
      </MenuItem>
      {TIPOS_SENSOR.map((tipo_sensor) => (
        <MenuItem key={tipo_sensor} value={tipo_sensor}>
          {tipo_sensor}
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
      {ESTADOS_SENSOR.map((estado) => (
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

const AdminSensores = () => {
  const [sensores, setSensores] = useState([]);
  const [formulario, setFormulario] = useState({ 
    id: '', 
    codigo: '', 
    tipo_sensor: '', 
    bodega: '', 
    estado: ''
  });
  const [operacionActual, setOperacionActual] = useState('registrar');
  const [sensorSeleccionado, setSensorSeleccionado] = useState(null);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [dialogoDetalles, setDialogoDetalles] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Simulación de cargar sensores desde la base de datos
    setSensores([
      {
      id: 1,
      codigo: 'SEN123',
      tipo_sensor: 'Tipo A',
      bodega: 'Bodega Norte',
      fabricante: 'Fabricante A',
      modelo: 'Modelo X',
      frecuencia: '40 KHz',
      rango_lectura: '20 m',
      fecha_registro: '01-12-2024',
      ultima_lectura: '10-12-2024 12:04:22',
      estado: 'Activo'
      },
      {
      id: '2',
      codigo: 'SEN456',
      tipo_sensor: 'Tipo C',
      bodega: 'Bodega Norte',
      fabricante: 'Fabricante B',
      modelo: 'Modelo Y',
      frecuencia: '40 KHz',
      rango_lectura: '10 m',
      fecha_registro: '01-12-2024',
      ultima_lectura: '-',
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
    if (!formulario.codigo || !formulario.tipo_sensor || !formulario.bodega || !formulario.estado) {
      mostrarSnackbar('Datos inválidos: Complete todos los campos.', 'error');
      return false;
    }
    if (
      sensores.some(
        (sens) => sens.id === formulario.id && sens.id !== sensorSeleccionado?.id
      )
    ) {
      mostrarSnackbar('Error: Sensor ya registrado.', 'error');
      return false;
    }
    return true;
  };

  const handleRegistrar = () => {
    if (!validarFormulario()) return;

    const nuevoSensor = {
      id: sensores.length + 1,
      ...formulario,
    };

    setSensores([...sensores, nuevoSensor]);
    setFormulario({ 
      id: '', 
      codigo: '', 
      tipo_sensor: '', 
      bodega: '', 
      estado: ''
    });
    mostrarSnackbar('Sensor registrado con éxito.', 'success');
  };

  const handleEditar = () => {
    if (!validarFormulario()) return;

    setSensores(
      sensores.map((sens) =>
        sens.id === sensorSeleccionado.id ? { ...sens, ...formulario } : sens
      )
    );
    setSensorSeleccionado(null);
    setFormulario({ 
      id: '', 
      codigo: '', 
      tipo_sensor: '', 
      bodega: '', 
      estado: '' 
    });
    setOperacionActual('registrar');
    mostrarSnackbar('Sensor actualizado con éxito.', 'success');
  };

  const handleEliminar = () => {
    setSensores(sensores.filter((sens) => sens.id !== sensorSeleccionado.id));
    setSensorSeleccionado(null);
    setDialogoEliminar(false);
    mostrarSnackbar('Sensor eliminado con éxito.', 'success');
  };

  const handleCerrarSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSeleccionarSensor = (sensor) => {
    setSensorSeleccionado(sensor);
    setFormulario(sensor);
    setOperacionActual('editar');
  };

  const handleVerDetalles = (sensor) => {
    setSensorSeleccionado(sensor);
    setDialogoDetalles(true);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Gestión de Sensores</h1>

        <FormularioSensor
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
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensores.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell>{sensor.codigo}</TableCell>
                  <TableCell>{sensor.tipo_sensor}</TableCell>
                  <TableCell>{sensor.bodega}</TableCell>
                  <TableCell>{sensor.estado}</TableCell>

                  <TableCell>
                    <Button
                      variant='text'
                      color='primary'
                      onClick={() => handleSeleccionarSensor(sensor)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant='text'
                      color='secondary'
                      onClick={() => {
                        setSensorSeleccionado(sensor);
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
                        onClick={() => handleVerDetalles(sensor)}
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
            ¿Está seguro de que desea eliminar el sensor '{sensorSeleccionado?.codigo}'?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogoEliminar(false)}>Cancelar</Button>
            <Button color='secondary' onClick={handleEliminar}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialogoDetalles} onClose={() => setDialogoDetalles(false)}>
          <DialogTitle>Detalles del Sensor</DialogTitle>
          <DialogContent>
            {sensorSeleccionado && (
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>{sensorSeleccionado.codigo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>{sensorSeleccionado.tipo_sensor}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bodega</TableCell>
                      <TableCell>{sensorSeleccionado.bodega}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fabricante</TableCell>
                      <TableCell>{sensorSeleccionado.fabricante}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Modelo</TableCell>
                      <TableCell>{sensorSeleccionado.modelo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Frecuencia</TableCell>
                      <TableCell>{sensorSeleccionado.frecuencia}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fecha de registro</TableCell>
                      <TableCell>{sensorSeleccionado.fecha_registro}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Última lectura</TableCell>
                      <TableCell>{sensorSeleccionado.ultima_lectura}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Estado</TableCell>
                      <TableCell>{sensorSeleccionado.estado}</TableCell>
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

export default AdminSensores;