import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root'; // Import the root route
import Homepage from '../components/Homepage'; // Import the component

export const homepageRoute = createRoute({
  getParentRoute: () => rootRoute, // Attach to the root route
  path: '/', // Path for the homepage
  component: Homepage, // Render the Homepage component
});