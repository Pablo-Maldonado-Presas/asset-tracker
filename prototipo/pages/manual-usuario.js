import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SideNav from '../components/SideNav';

const TabContent = ({ title, description, image }) => (
  <Card
    sx={{
      marginTop: 3,
      padding: 2,
      boxShadow: 3,
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
    }}
  >
    <CardContent>
      <Typography variant='h5' gutterBottom>
        {title}
      </Typography>
      <Typography variant='body1'>{description}</Typography>
      {image && (
        <Box
          component='img'
          src={image}
          alt={`${title} - Ilustración`}
          sx={{
            maxWidth: '100%',
            maxHeight: 400,
            marginTop: 2,
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: '1px solid #ccc',
          }}
        />
      )}
    </CardContent>
  </Card>
);

const ManualUsuario = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [adminTabIndex, setAdminTabIndex] = useState(0);  // Estado para las subpestañas

  const tabData = [
    {
      label: 'Dashboard',
      content: {
        title: 'Sección: Dashboard',
        description:
          'El Dashboard proporciona una visión general de los datos y métricas más importantes relacionados con el seguimiento de activos.',
        image: '/manual-usuario/dashboard.png',
        help: 'Esta sección ofrece una visión general con gráficos y estadísticas clave.',
      },
    },
    {
      label: 'Administración',
      content: {
        title: 'Sección: Administración',
        description:
          'La sección de Administración está diseñada para gestionar la configuración general del sistema.',
        image: '/manual-usuario/administracion.png',
        help: 'Aquí puedes configurar el sistema según las necesidades de tu organización.',
        subTabs: [
          { label: 'Pallets', description: 'Gestiona los pallets dentro del sistema.', image: '/manual-usuario/pallets.png' },
          { label: 'Etiquetas', description: 'Configura y gestiona las etiquetas RFID.', image: '/manual-usuario/etiquetas.png' },
          { label: 'Sensores', description: 'Administra los sensores asociados a los pallets.', image: '/manual-usuario/sensores.png' },
          { label: 'Antenas', description: 'Configura las antenas para la lectura RFID.', image: '/manual-usuario/antenas.png' },
        ],
      },
    },
    {
      label: 'Panel de Trazabilidad',
      content: {
        title: 'Sección: Panel de Trazabilidad',
        description:
          'La sección Panel de Trazabilidad permite monitorear las entradas y salidas de los pallets en tiempo real, con capacidad de búsqueda y filtrado.',
        image: '/manual-usuario/panel-trazabilidad.png',
        help: 'Consulta los movimientos de pallets y su ubicación en tiempo real.',
      },
    },
    {
      label: 'Gestión de Usuarios',
      content: {
        title: 'Sección: Gestión de Usuarios',
        description:
          'La sección Gestión de Usuarios permite administrar los usuarios del sistema, incluyendo registro, edición y asignación de roles.',
        image: '/manual-usuario/gestion-usuarios.png',
        help: 'Administra usuarios y roles para controlar el acceso al sistema.',
      },
    },
    {
      label: 'Historial de Transacciones',
      content: {
        title: 'Sección: Historial de Transacciones',
        description:
          'La sección Historial de Transacciones permite acceder a un registro detallado de todas las actividades realizadas con los dispositivos RFID.',
        image: '/manual-usuario/historial-transacciones-1.png',
        help: 'Consulta el historial de transacciones para auditorías y análisis.',
      },
    },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Barra lateral */}
      <Box sx={{ width: 240, flexShrink: 0, overflowY: 'auto', height: '100vh' }}>
        <SideNav />
      </Box>

      {/* Contenido principal */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          padding: 3,
          maxWidth: 1200,
          margin: '0 auto',
          marginLeft: 3,
        }}
      >
        {/* Título principal */}
        <Typography variant='h4' gutterBottom>
          Manual de Usuario - Administrador
        </Typography>

        {/* Pestañas */}
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          indicatorColor='primary'
          textColor='primary'
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .Mui-selected': { backgroundColor: '#e3f2fd', borderRadius: '4px' },
          }}
          aria-label='Navegación de pestañas del manual'
        >
          {tabData.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>

        {/* Contenido dinámico */}
        <Box sx={{ paddingTop: 3 }}>
          {tabData.map((tab, index) => (
            <div
              key={index}
              id={`tabpanel-${index}`}
              role='tabpanel'
              hidden={tabIndex !== index}
              aria-labelledby={`tab-${index}`}
            >
              {tabIndex === index && (
                <>
                  {/* Botón de ayuda */}
                  <Tooltip title={tab.content.help} placement='top'>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 20,
                        top: 15,
                        color: '#2196f3',
                      }}
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Contenido de la pestaña */}
                  {tab.label === 'Administración' ? (
                    <>
                      {/* Subpestañas dentro de Administración */}
                      <Tabs
                        value={adminTabIndex}
                        onChange={(_, newValue) => setAdminTabIndex(newValue)}
                        indicatorColor='primary'
                        textColor='primary'
                        sx={{
                          borderBottom: 1,
                          borderColor: 'divider',
                          marginBottom: 2,
                        }}
                      >
                        {tab.content.subTabs.map((subTab, index) => (
                          <Tab key={index} label={subTab.label} id={`subtab-${index}`} />
                        ))}
                      </Tabs>

                      {/* Contenido de las subpestañas */}
                      {tab.content.subTabs.map((subTab, index) => (
                        <div
                          key={index}
                          role='tabpanel'
                          hidden={adminTabIndex !== index}
                          aria-labelledby={`subtab-${index}`}
                        >
                          {adminTabIndex === index && (
                            <TabContent
                              title={subTab.label}
                              description={subTab.description}
                              image={subTab.image}
                            />
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <TabContent
                      title={tab.content.title}
                      description={tab.content.description}
                      image={tab.content.image}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ManualUsuario;