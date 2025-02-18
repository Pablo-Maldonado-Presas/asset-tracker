import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  CircularProgress,
  TextField,
} from '@mui/material';
import SideNav from '../components/SideNav';

const DATOS_TRAZABILIDAD = [
  { id: 1, estado: 'ENTRADA', codigoPallet: 'PAL001', bodega: 'Bodega Central', ubicacion: 'Estante 1', fecha: '06-01-2025 10:00:00' },
  { id: 2, estado: 'SALIDA', codigoPallet: 'PAL002', bodega: 'Bodega Norte', ubicacion: 'Estante 2', fecha: '06-01-2025 12:00:00' },
  { id: 3, estado: 'ENTRADA', codigoPallet: 'PAL003', bodega: 'Bodega Sur', ubicacion: 'Estante 3', fecha: '06-01-2025 14:00:00' },
  { id: 4, estado: 'SALIDA', codigoPallet: 'PAL004', bodega: 'Bodega Este', ubicacion: 'Estante 4', fecha: '06-01-2025 16:00:00' },
  { id: 5, estado: 'ENTRADA', codigoPallet: 'PAL005', bodega: 'Bodega Oeste', ubicacion: 'Estante 5', fecha: '06-01-2025 18:00:00' },
];

const PanelTrazabilidad = () => {
  const [datos] = useState(DATOS_TRAZABILIDAD);
  const [filteredData, setFilteredData] = useState(DATOS_TRAZABILIDAD);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = datos.filter((row) =>
      Object.values(row).some((val) => val.toString().toLowerCase().includes(value))
    );
    setFilteredData(filtered);
    setPage(0); // Reinicia a la primera página en búsquedas
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (date) => {
    const [day, month, yearAndTime] = date.split('-');
    const [year, time] = yearAndTime.split(' ');
    return `${day}-${month}-${year}, ${time.substring(0, 5)}`;
  };

  const getEstadoChip = (estado) => (
    <Chip
      label={estado}
      color={estado === 'ENTRADA' ? 'success' : 'warning'}
      sx={{
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', height: '100vh' }}>
        <Typography variant="h4" gutterBottom>
          <strong>Panel de Trazabilidad</strong>
        </Typography>

        {/* Buscador */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <TextField
            variant="outlined"
            label="Buscar"
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ width: 300 }}
          />
        </Box>

        {/* Tabla de datos */}
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Table aria-label="Panel de Trazabilidad">
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('id')} sx={{ cursor: 'pointer' }}>
                  #
                  {orderBy === 'id' ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('estado')} sx={{ cursor: 'pointer' }}>
                  Estado
                  {orderBy === 'estado' ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('codigoPallet')} sx={{ cursor: 'pointer' }}>
                  Código Pallet
                  {orderBy === 'codigoPallet' ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('bodega')} sx={{ cursor: 'pointer' }}>
                  Bodega
                  {orderBy === 'bodega' ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('ubicacion')} sx={{ cursor: 'pointer' }}>
                  Ubicación
                  {orderBy === 'ubicacion' ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('fecha')} sx={{ cursor: 'pointer' }}>
                  Fecha
                  {orderBy === 'fecha' ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                    '&:hover': { backgroundColor: '#e0f7fa' },
                  }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{getEstadoChip(row.estado)}</TableCell>
                  <TableCell>{row.codigoPallet}</TableCell>
                  <TableCell>{row.bodega}</TableCell>
                  <TableCell>{row.ubicacion}</TableCell>
                  <TableCell>{formatDate(row.fecha)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Mensaje sin resultados */}
        {filteredData.length === 0 && (
          <Typography variant="body1" align="center" sx={{ marginTop: 3 }}>
            No se encontraron resultados.
          </Typography>
        )}

        {/* Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage="Filas por página"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          aria-label="Paginación de la tabla de trazabilidad"
        />
      </Box>
    </Box>
  );
};

export default PanelTrazabilidad;