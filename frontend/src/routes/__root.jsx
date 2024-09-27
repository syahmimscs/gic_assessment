import React from 'react';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import Navbar from '../components/Navbar';

export const rootRoute = createRootRoute({
  component: () => {
    const { location } = useRouterState(); // Get the current location path

    const isHomePage = location.pathname === '/';

    return (
      <>
        {/* Conditionally render Navbar only if it's NOT the home page */}
        {!isHomePage && <Navbar />}
        
        <Outlet /> {/* Render child routes */}
        
        <TanStackRouterDevtools />
      </>
    );
  },
});