import { rootRoute } from './__root';
import { homepageRoute } from './homepageRoute';
import { cafesRoute } from './cafesRoute';
import { employeesRoute } from './employeesRoute';
import { cafeFormRoute } from './cafeFormRoute';
import { employeeFormRoute } from './employeeFormRoute';

// Combine all routes as children of rootRoute
export const routeTree = rootRoute.addChildren([homepageRoute, cafesRoute, cafeFormRoute, employeesRoute, employeeFormRoute]);