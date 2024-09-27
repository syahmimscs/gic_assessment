import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useRouterState } from '@tanstack/react-router'; // Use useRouterState to track route state

const Navbar = () => {
  // Get the current router state to detect the active route
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000', boxShadow: 'none', padding: '10px 0'  }}>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          maxWidth: '1200px', 
          width: '100%', 
          margin: '0 auto'
        }}
      >
        {/* Left side: Logo and title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="../../public/coffee.svg"
            alt="Cafe Management"
            style={{ height: '30px', marginRight: '10px' }}
          />
          <h5 style={{ margin: 0, fontWeight: 400, color: '#5c7c7c' }}>Cafe Management</h5>
        </Box>

        {/* Right side: Cafes and Employees links */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Cafes button, highlight when active */}
          <Button
            sx={{
              color: currentPath === '/cafes' ? '#1976d2' : '#5c7c7c', // Highlight if active
              fontWeight: currentPath === '/cafes' ? 'bold' : 'normal', // Bold when active
            }}
            component={Link}
            to="/cafes"
          >
            Cafes
          </Button>

          {/* Employees button, highlight when active */}
          <Button
            sx={{
              color: currentPath === '/employees' ? '#1976d2' : '#5c7c7c', // Highlight if active
              fontWeight: currentPath === '/employees' ? 'bold' : 'normal', // Bold when active
            }}
            component={Link}
            to="/employees"
          >
            Employees
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;