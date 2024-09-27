import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button } from "@mui/material";
import ActionButtons from "./ActionButtons";

const EmployeesPage = () => {
  const [allEmployees, setAllEmployees] = useState([]); // Store all employees initially fetched
  const [employees, setEmployees] = useState([]); // Employees to display
  const [searchCafe, setSearchCafe] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object to extract query parameters

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cafeFromQuery = params.get("cafe"); // Extract cafe from query string if available

    if (cafeFromQuery) {
      console.log("Cafe name from query:", cafeFromQuery);
      filterEmployeesByCafe(cafeFromQuery); // Apply filtering if query exists
    }
  }, [location.search, allEmployees]); // Re-run this when the location or allEmployees change

  // Fetch employees once from the backend
  const fetchEmployees = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:5001/employees")
      .then((response) => {
        console.log("Employees fetched:", response.data);
        setAllEmployees(response.data); // Store all employees
        setEmployees(response.data); // Initially display all employees
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setIsLoading(false); // Stop loading in case of an error
      });
  };

  // Filter employees based on cafe name input
  const filterEmployeesByCafe = (cafeName) => {
    console.log("Filtering employees for cafe:", cafeName);
    if (cafeName.trim() === "") {
      console.log("Empty search, showing all employees.");
      setEmployees(allEmployees); // If search is empty, show all employees
    } else {
      const filteredEmployees = allEmployees.filter(
        (employee) =>
          employee.cafe.toLowerCase().includes(cafeName.toLowerCase()) // Case-insensitive filtering
      );
      console.log("Filtered employees:", filteredEmployees);
      setEmployees(filteredEmployees);
    }
  };

  const handleSearch = () => {
    console.log("Manual search by user for cafe:", searchCafe);
    filterEmployeesByCafe(searchCafe); // Apply search filter when clicking the search button
  };

  const editEmployee = (id) => {
    navigate({ to: `/employees/form`, search: { id } });
  };

  const confirmDeleteEmployee = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmed) {
      deleteEmployee(id);
    }
  };

  const deleteEmployee = (id) => {
    axios
      .delete(`http://localhost:5001/employee/${id}`)
      .then(() => {
        setEmployees(employees.filter((employee) => employee.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      cellRendererFramework: (params) => params.value.slice(0, 3) + "...",
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email_address", headerName: "Email", width: 200 },
    { field: "phone_number", headerName: "Phone Number", width: 150 },
    { field: "days_worked", headerName: "Days Worked", width: 150 },
    { field: "cafe", headerName: "Cafe", width: 150 },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <ActionButtons
          item={params.data}
          onEdit={editEmployee} // Use the appropriate edit function
          onDelete={confirmDeleteEmployee} // Use the appropriate delete function
          idField="id"
        />
      ),
      sortable: false,
      filter: false,
      width: 200,
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  ];

  if (isLoading) return <div>Loading...</div>; // Ensure loading is correctly handled

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Employee Explorer</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by cafe name"
          value={searchCafe}
          onChange={(e) => setSearchCafe(e.target.value)} // Set the search input
          style={{ padding: "10px", borderRadius: "5px", width: "300px" }}
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          style={{ padding: "10px" }}
        >
          SEARCH
        </Button>
        <Button
          onClick={() => navigate({ to: "/employees/form" })}
          variant="contained"
          color="secondary"
          style={{ padding: "10px" }}
        >
          + ADD NEW EMPLOYEE
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={employees}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default EmployeesPage;
