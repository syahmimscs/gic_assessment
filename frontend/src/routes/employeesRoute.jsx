import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root'; // Import the root route
import EmployeesPage from '../components/EmployeesPage'; // Import the component

export const employeesRoute = createRoute({
  getParentRoute: () => rootRoute, // Attach to the root route
  path: '/employees', // Path for the Employees page
  component: EmployeesPage, // Render the EmployeesPage component
});