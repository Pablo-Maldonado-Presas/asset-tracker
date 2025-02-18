import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SideNav from '../components/SideNav';

const DATOS_TRANSACCION = {
  etiquetas: [
    { id: 1, fecha: '10-12-2024', hora: '12:04:22', entidad: 'Etiqueta', accion: 'Lectura', detalle: 'Etiqueta 123 leída' },
    { id: 2, fecha: '10-12-2024', hora: '15:00:02', entidad: 'Etiqueta', accion: 'Escritura', detalle: 'Etiqueta 456 actualizada' },
    { id: 3, fecha: '11-12-2024', hora: '16:51:55', entidad: 'Etiqueta', accion: 'Lectura', detalle: 'Etiqueta 456 leída' },
    { id: 4, fecha: '11-12-2024', hora: '17:59:00', entidad: 'Etiqueta', accion: 'Escritura', detalle: 'Etiqueta 123 actualizada' },
  ],
  sensores: [
    { id: 1, fecha: '01-12-2024', hora: '-', entidad: 'Sensor', accion: 'Configuración', detalle: 'Sensor 123 configurado' },
    { id: 2, fecha: '01-12-2024', hora: '-', entidad: 'Sensor', accion: 'Configuración', detalle: 'Sensor 456 configurado' },
    { id: 3, fecha: '09-12-2024', hora: '14:22:00', entidad: 'Sensor', accion: 'Activación', detalle: 'Sensor 123 activado' },
    { id: 4, fecha: '10-12-2024', hora: '12:04:22', entidad: 'Sensor', accion: 'Lectura', detalle: 'Lectura de etiqueta 123' },
    { id: 5, fecha: '11-12-2024', hora: '16:51:55', entidad: 'Sensor', accion: 'Lectura', detalle: 'Lectura de etiqueta 456' },
  ],
  antenas: [
    { id: 1, fecha: '01-12-2024', hora: '-', entidad: 'Antena', accion: 'Instalación', detalle: 'Antena 123 instalada' },
    { id: 2, fecha: '01-12-2024', hora: '-', entidad: 'Antena', accion: 'Configuración', detalle: 'Antena 123 configurada' },
    { id: 3, fecha: '01-12-2024', hora: '-', entidad: 'Antena', accion: 'Instalación', detalle: 'Antena 456 instalada' },
    { id: 4, fecha: '01-12-2024', hora: '-', entidad: 'Antena', accion: 'Configuración', detalle: 'Antena 456 configurada' },
    { id: 5, fecha: '08-12-2024', hora: '09:00:00', entidad: 'Antena', accion: 'Activación', detalle: 'Antena 123 activada' },
  ],
};

const HistorialTransacciones = () => {
  const [entidadSeleccionada, setEntidadSeleccionada] = useState('etiquetas');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const transacciones = DATOS_TRANSACCION[entidadSeleccionada] || [];

  const handleChangeTab = (_, newValue) => {
    setEntidadSeleccionada(newValue);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const savedTab = localStorage.getItem('entidadSeleccionada');
    if (savedTab) {
      setEntidadSeleccionada(savedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('entidadSeleccionada', entidadSeleccionada);
  }, [entidadSeleccionada]);

  // Filtro por fechas
  const transaccionesFiltradas = transacciones.filter((t) => {
    const fechaValida = (!fechaInicio || new Date(t.fecha.split('-').reverse().join('-')) >= new Date(fechaInicio)) &&
                        (!fechaFin || new Date(t.fecha.split('-').reverse().join('-')) <= new Date(fechaFin));
    return fechaValida;
  });

  // Datos para el gráfico
  const fechas = transaccionesFiltradas.map((t) => t.fecha);
  const cantidadPorFecha = fechas.reduce((acc, fecha) => {
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});
  const data = Object.keys(cantidadPorFecha).map((fecha) => ({
    fecha,
    cantidad: cantidadPorFecha[fecha],
  }));

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', height: '100vh' }}>
        <Typography variant='h4' gutterBottom>
          Historial de Transacciones
        </Typography>
        <Tabs
          value={entidadSeleccionada}
          onChange={handleChangeTab}
          centered
          sx={{ marginBottom: '20px' }}
        >
          <Tab label='Etiquetas' value='etiquetas' />
          <Tab label='Sensores' value='sensores' />
          <Tab label='Antenas' value='antenas' />
        </Tabs>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflow: 'hidden' }}>
          {/* Filtro por fechas */}
          <Box>
            <Typography variant='h6' gutterBottom>
              Filtrar por fecha
            </Typography>
            <TextField
              label='Fecha de inicio'
              type='date'
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ marginRight: '20px' }}
            />
            <TextField
              label='Fecha de fin'
              type='date'
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          {/* Contenedor con scroll solo para las transacciones */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto', height: 'calc(100vh - 150px)' }}>
            {/* Contenedor Lista de Transacciones */}
            <Box sx={{ flex: 1 }}>
              <Typography variant='h4' gutterBottom>
                Lista de Transacciones
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label='Historial de transacciones'>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>ID</TableCell>
                      <TableCell scope='col'>Fecha</TableCell>
                      <TableCell scope='col'>Hora</TableCell>
                      <TableCell scope='col'>Acción</TableCell>
                      <TableCell scope='col'>Detalle</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transaccionesFiltradas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.fecha}</TableCell>
                        <TableCell>{row.hora}</TableCell>
                        <TableCell>{row.accion}</TableCell>
                        <TableCell>{row.detalle}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component='div'
                count={transaccionesFiltradas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage='Filas por página'
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
            {/* Contenedor Gráfico de Barras */}
            <Box sx={{ flex: 1 }}>
              <Typography variant='h6' gutterBottom>
                Estadísticas de Transacciones
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} aria-label='Gráfico de transacciones por fecha'>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='fecha' />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='cantidad' fill='#8884d8' />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HistorialTransacciones;