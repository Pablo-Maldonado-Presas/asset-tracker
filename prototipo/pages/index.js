import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Snackbar, Alert, IconButton, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const router = useRouter();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username || !password) {
      setShowSnackbar({ open: true, message: 'Complete los campos', severity: 'error' });
      return;
    }

    // Simulación de autenticación
    if (username === 'admin' && password === 'admin') {
      setShowSnackbar({ open: true, message: 'Inicio de sesión exitoso', severity: 'success' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      setShowSnackbar({ open: true, message: 'Credenciales incorrectas', severity: 'error' });
    }
  };

  const handlePasswordRecovery = (event) => {
    event.preventDefault();

    if (!recoveryEmail) {
      setShowSnackbar({ open: true, message: 'Por favor, ingrese su correo', severity: 'error' });
      return;
    }

    if (!validateEmail(recoveryEmail)) {
      setShowSnackbar({ open: true, message: 'Por favor, ingrese un correo válido', severity: 'error' });
      return;
    }

    // Simulación de envío de enlace de recuperación
    setShowSnackbar({
      open: true,
      message: `Se ha enviado un enlace de recuperación a ${recoveryEmail}`,
      severity: 'success',
    });
    setTimeout(() => {
      setIsRecoveringPassword(false);
    }, 2000);
  };

  const closeSnackbar = () => {
    setShowSnackbar({ open: false, message: '', severity: 'error' });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {isRecoveringPassword ? (
        <form
          onSubmit={handlePasswordRecovery}
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <img src='/logo.png' alt='Asset Tracker Logo' style={{ display: 'block', margin: '0 auto', maxWidth: '150px', marginBottom: '20px' }} />
          <Typography variant='h5' style={{ textAlign: 'center', marginBottom: '20px', color: '#1976d2' }}>
            Recuperar contraseña
          </Typography>
          <TextField
            label='Correo electrónico'
            variant='outlined'
            fullWidth
            margin='normal'
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
          <Button type='submit' color='primary' variant='contained' fullWidth style={{ marginTop: '20px', borderRadius: '20px' }}>
            Enviar Enlace de Recuperación
          </Button>
          <Button
            color='secondary'
            variant='text'
            fullWidth
            style={{ marginTop: '10px' }}
            onClick={() => setIsRecoveringPassword(false)}
          >
            Volver a Iniciar Sesión
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleLogin}
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <img src='/logo.png' alt='Asset Tracker Logo' style={{ display: 'block', margin: '0 auto', maxWidth: '150px', marginBottom: '20px' }} />
          <Typography variant='h5' style={{ textAlign: 'center', marginBottom: '20px', color: '#1976d2'}}>
            Asset Tracker
          </Typography>
          <TextField
            label='Usuario'
            variant='outlined'
            fullWidth
            margin='normal'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label='Contraseña'
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            fullWidth
            margin='normal'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }
            }}
          />
          <Button type='submit' color='primary' variant='contained' fullWidth style={{ marginTop: '20px', borderRadius: '20px' }}>
            Iniciar Sesión
          </Button>
          <Button
            color='secondary'
            variant='text'
            fullWidth
            style={{ marginTop: '10px' }}
            onClick={() => setIsRecoveringPassword(true)}
          >
            Recuperar contraseña
          </Button>
        </form>
      )}
      <Snackbar
        open={showSnackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={showSnackbar.severity} sx={{ width: '100%' }}>
          {showSnackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;