import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

const HomePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        color: '#000',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Cafe Management
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Choose your next action!
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          component={Link}
          to="/cafes"
          startIcon={<img src="../../public/coffee.svg" alt="Manage Cafes" style={{ width: 24 }} />}
          sx={{ padding: '12px 24px', fontSize: '18px' }}
        >
          Manage Cafes
        </Button>

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/employees"
          startIcon={<img src="../../public/employee.svg" alt="Manage Employees" style={{ width: 24 }} />}
          sx={{ padding: '12px 24px', fontSize: '18px' }}
        >
          Manage Employees
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;