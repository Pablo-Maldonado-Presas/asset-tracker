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
  Typography
} from '@mui/material';
import SideNav from '../components/SideNav';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';

const BODEGAS = ['Bodega Central', 'Bodega Norte', 'Bodega Sur', 'Bodega Este', 'Bodega Oeste'];
const UBICACIONES = ['Estante 1', 'Estante 2', 'Estante 3', 'Estante 4', 'Estante 5'];

const FormularioPallet = ({ formulario, onChange, onSubmit, operacionActual }) => (
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
      label='Etiqueta'
      name='etiqueta'
      variant='outlined'
      value={formulario.etiqueta}
      onChange={onChange}
      style={{ marginRight: '10px' }}
    />
    <Button variant='contained' color='primary' onClick={onSubmit}>
      {operacionActual === 'registrar' ? 'Registrar' : 'Editar'}
    </Button>
  </div>
);

const AdminPallets = () => {
  const [pallets, setPallets] = useState([]);
  const [formulario, setFormulario] = useState({ codigo: '', bodega: '', ubicacion: '', etiqueta: ''});
  const [operacionActual, setOperacionActual] = useState('registrar');
  const [palletSeleccionado, setPalletSeleccionado] = useState(null);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [dialogoDetalles, setDialogoDetalles] = useState(false);
  const [dialogoDuplicados, setDialogoDuplicados] = useState(false);
  const [duplicados, setDuplicados] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setPallets([
      { id: 1, 
        codigo: 'PAL123', 
        bodega: 'Bodega Norte', 
        ubicacion: 'Estante 1', 
        etiqueta: 'ETQ123', 
        fecha_modificacion: '10-12-2024 12:04:22' },
      { id: 2, 
        codigo: 'PAL456', 
        bodega: 'Bodega Norte', 
        ubicacion: 'Estante 2', 
        etiqueta: 'ETQ456', 
        fecha_modificacion: '11-12-2024 16:51:55' },
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
    if (!formulario.codigo || !formulario.bodega || !formulario.ubicacion || !formulario.etiqueta) {
      mostrarSnackbar('Datos inválidos: Complete todos los campos.', 'error');
      return false;
    }
    if (
      pallets.some(
        (pal) => pal.codigo === formulario.codigo && pal.id !== palletSeleccionado?.id
      )
    ) {
      mostrarSnackbar('Error: Pallet ya registrado.', 'error');
      return false;
    }
    return true;
  };

  const handleRegistrar = () => {
    if (!validarFormulario()) return;

    const nuevoPallet = {
      id: pallets.length + 1,
      ...formulario,
    };

    setPallets([...pallets, nuevoPallet]);
    setFormulario({ codigo: '', bodega: '', ubicacion: '', etiqueta: ''});
    mostrarSnackbar('Pallet registrado con éxito.', 'success');
  };

  const handleEditar = () => {
    if (!validarFormulario()) return;

    setPallets(
      pallets.map((pal) =>
        pal.id === palletSeleccionado.id ? { ...pal, ...formulario } : pal
      )
    );
    setPalletSeleccionado(null);
    setFormulario({ codigo: '', bodega: '', ubicacion: '', etiqueta: ''});
    setOperacionActual('registrar');
    mostrarSnackbar('Pallet actualizado con éxito.', 'success');
  };

  const handleEliminar = () => {
    setPallets(pallets.filter((pal) => pal.id !== palletSeleccionado.id));
    setPalletSeleccionado(null);
    setDialogoEliminar(false);
    mostrarSnackbar('Pallet eliminado con éxito.', 'success');
  };

  const handleCerrarSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSeleccionarPallet = (pallet) => {
    setPalletSeleccionado(pallet);
    setFormulario(pallet);
    setOperacionActual('editar');
  };

  const handleVerDetalles = (pallet) => {
    setPalletSeleccionado(pallet);
    setDialogoDetalles(true);
  };

  const handleImportarCSV = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const duplicados = results.data.filter(row => 
            pallets.some(pal => pal.codigo === row.codigo)
          );
          const nuevosPallets = results.data.filter(row => 
            !pallets.some(pal => pal.codigo === row.codigo)
          ).map((row, index) => ({
            id: pallets.length + index + 1,
            codigo: row.codigo,
            bodega: row.bodega,
            ubicacion: row.ubicacion,
            etiqueta: row.etiqueta,
            fecha_modificacion: row.fecha_modificacion,
          }));
          if (duplicados.length > 0) {
            setDuplicados(duplicados);
            setDialogoDuplicados(true);
          } else {
            setPallets([...pallets, ...nuevosPallets]);
            mostrarSnackbar('Pallets importados con éxito.', 'success');
          }
        },
      });
    }
  };

  const handleConfirmarImportacion = () => {
    const nuevosPallets = duplicados.filter(row => 
      !pallets.some(pal => pal.codigo === row.codigo)
    ).map((row, index) => ({
      id: pallets.length + index + 1,
      codigo: row.codigo,
      bodega: row.bodega,
      ubicacion: row.ubicacion,
      etiqueta: row.etiqueta,
      fecha_modificacion: row.fecha_modificacion,
    }));
    setPallets([...pallets, ...nuevosPallets]);
    setDialogoDuplicados(false);
    mostrarSnackbar('Pallets importados con éxito, excluyendo duplicados.', 'success');
  };

  const csvHeaders = [
    { label: 'codigo', key: 'codigo' },
    { label: 'bodega', key: 'bodega' },
    { label: 'ubicacion', key: 'ubicacion' },
    { label: 'etiqueta', key: 'etiqueta' },
    { label: 'fecha_modificacion', key: 'fecha_modificacion' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Gestión de Pallets</h1>

        <FormularioPallet
          formulario={formulario}
          onChange={handleFormularioChange}
          onSubmit={operacionActual === 'registrar' ? handleRegistrar : handleEditar}
          operacionActual={operacionActual}
        />

        <div style={{ marginBottom: '20px' }}>
          <input
            accept='.csv'
            style={{ display: 'none' }}
            id='importar-csv'
            type='file'
            onChange={handleImportarCSV}
          />
          <label htmlFor='importar-csv'>
            <Button variant='contained' color='primary' component='span' style={{ marginRight: '10px' }}>
              Importar CSV
            </Button>
          </label>
          <Button variant='contained' color='primary'>
            <CSVLink
              data={pallets}
              headers={csvHeaders}
              filename='pallets.csv'
              style={{ textDecoration: 'none', color: 'inherit' }}
              quoteStrings='false'
            >
              Exportar CSV
            </CSVLink>
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Bodega</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Etiqueta asociada</TableCell>
                <TableCell>Acciones</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pallets.map((pallet) => (
                <TableRow key={pallet.id}>
                  <TableCell>{pallet.codigo}</TableCell>
                  <TableCell>{pallet.bodega}</TableCell>
                  <TableCell>{pallet.ubicacion}</TableCell>
                  <TableCell>{pallet.etiqueta}</TableCell>
                  <TableCell>
                    <Button
                      variant='text'
                      color='primary'
                      onClick={() => handleSeleccionarPallet(pallet)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant='text'
                      color='secondary'
                      onClick={() => {
                        setPalletSeleccionado(pallet);
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
                      onClick={() => handleVerDetalles(pallet)}
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
            ¿Está seguro de que desea eliminar el pallet '{palletSeleccionado?.codigo}'?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogoEliminar(false)}>Cancelar</Button>
            <Button color='secondary' onClick={handleEliminar}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialogoDetalles} onClose={() => setDialogoDetalles(false)}>
          <DialogTitle>Detalles del Pallet</DialogTitle>
          <DialogContent>
            {palletSeleccionado && (
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>{palletSeleccionado.codigo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bodega</TableCell>
                      <TableCell>{palletSeleccionado.bodega}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>{palletSeleccionado.ubicacion}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Etiqueta asociada</TableCell>
                      <TableCell>{palletSeleccionado.etiqueta}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Última modificación</TableCell>
                      <TableCell>{palletSeleccionado.fecha_modificacion}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={dialogoDuplicados} onClose={() => setDialogoDuplicados(false)}>
          <DialogTitle>Registros Duplicados</DialogTitle>
          <DialogContent>
            <Typography>
              Se encontraron {duplicados.length} registros con códigos duplicados. Se importarán únicamente los registros no duplicados.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogoDuplicados(false)}>Cancelar</Button>
            <Button color='primary' onClick={handleConfirmarImportacion}>
              Confirmar
            </Button>
          </DialogActions>
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

export default AdminPallets;