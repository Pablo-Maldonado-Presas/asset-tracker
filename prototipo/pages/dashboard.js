import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import SideNav from '../components/SideNav';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simular carga de datos desde una API
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);

        // Simulación de datos cargados desde un backend
        setTimeout(() => {
          const pieDataFromAPI = [
            { name: 'Compañía 1', value: 400 },
            { name: 'Compañía 2', value: 300 },
            { name: 'Compañía 3', value: 300 },
            { name: 'Compañía 4', value: 200 },
          ];
          const barDataFromAPI = [
            { name: '01 Marzo', Registrados: 100, Recibidos: 200, Despachados: 150 },
            { name: '02 Marzo', Registrados: 120, Recibidos: 210, Despachados: 180 },
            { name: '03 Marzo', Registrados: 140, Recibidos: 220, Despachados: 200 },
          ];
          const metricsFromAPI = [
            { title: 'Total de Pallets', value: 1245 },
            { title: 'Total de Etiquetas', value: 2000 },
            { title: 'Total de Sensores', value: 84 },
            { title: 'Total de Antenas', value: 12 },
          ];

          setPieData(pieDataFromAPI);
          setBarData(barDataFromAPI);
          setMetrics(metricsFromAPI);
          setLoading(false);
        }, 2000); // Simulación de carga de datos
      } catch (err) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>

      <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 0, overflowY: 'auto', maxHeight: '100vh' }}>
        <Typography variant='h4' gutterBottom sx={{ marginBottom: 5 }}>
          Dashboard
        </Typography>

        {/* Carga de datos o error */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant='h6' color='error' align='center'>
            {error}
          </Typography>
        ) : (
          <>
            {/* Métricas globales */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: 3, flexWrap: 'wrap' }}>
              {metrics.map((metric, index) => (
                <Card
                  key={index}
                  elevation={3}
                  sx={{
                    width: { xs: '100%', sm: '20%' },
                    textAlign: 'center',
                    padding: 2,
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    marginBottom: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant='h6' color='textSecondary'>
                      {metric.title}
                    </Typography>
                    <Typography variant='h4' color='primary'>
                      {metric.value}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Gráficos */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {/* Gráfico circular */}
              <Card sx={{ width: { xs: '100%', sm: '45%' }, marginBottom: 2 }}>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    Despachos por Empresa
                  </Typography>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={pieData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      fill='#8884d8'
                      label
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </CardContent>
              </Card>

              {/* Gráfico de barras */}
              <Card sx={{ width: { xs: '100%', sm: '45%' } }}>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    Eventos de Activos por Fecha
                  </Typography>
                  <BarChart width={500} height={300} data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='Registrados' fill='#8884d8' />
                    <Bar dataKey='Recibidos' fill='#82ca9d' />
                    <Bar dataKey='Despachados' fill='#ffc658' />
                  </BarChart>
                </CardContent>
              </Card>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;