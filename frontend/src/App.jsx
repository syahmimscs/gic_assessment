import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';  // Import your router here

function App() {
  return (
    <div>
      <RouterProvider router={router} /> 
    </div>
  );
}

export default App;