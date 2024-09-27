import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root'; // Import the root route
import EmployeeForm from '../components/EmployeeForm'; 

export const employeeFormRoute = createRoute({
  getParentRoute: () => rootRoute, // Attach to the root route
  path: '/employees/form', 
  component: EmployeeForm, 
});