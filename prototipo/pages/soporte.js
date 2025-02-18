import { Box } from '@mui/material';
import SideNav from '../components/SideNav';

const Soporte = () => (
    <div style={{ display: 'flex' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Soporte</h1>
        <p>No disponible</p>
      </div>
    </div>
  );
  
  export default Soporte;