import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root'; // Import the root route
import CafesPage from '../components/CafesPage'; // Import the component

export const cafesRoute = createRoute({
  getParentRoute: () => rootRoute, // Attach to the root route
  path: '/cafes', // Path for the Cafes page
  component: CafesPage, // Render the CafesPage component
});