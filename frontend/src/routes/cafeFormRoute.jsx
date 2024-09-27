import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root'; // Import the root route
import CafeForm from '../components/CafeForm'; // Import the CafeForm component

export const cafeFormRoute = createRoute({
  getParentRoute: () => rootRoute, // Attach to the root route
  path: '/cafes/form', // Path for the Cafe form (for both add and edit)
  component: CafeForm, // Render the CafeForm component
});