import { Box } from '@mui/material';
import SideNav from '../components/SideNav';

const FAQ = () => (
    <div style={{ display: 'flex' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <SideNav />
      </Box>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>FAQ</h1>
        <p>No disponible</p>
      </div>
    </div>
  );
  
  export default FAQ;