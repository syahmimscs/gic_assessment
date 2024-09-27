import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from '@tanstack/react-router';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '@mui/material';
import ActionButtons from './ActionButtons';  // Import ActionButtons component

const CafesPage = () => {
  const [allCafes, setAllCafes] = useState([]);  // Store all cafes fetched from the backend
  const [cafes, setCafes] = useState([]);  // Cafes to display
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCafes();
  }, []);

  // Fetch all cafes once from the backend
  const fetchCafes = () => {
    setIsLoading(true);
    axios
      .get('http://localhost:5001/cafes')
      .then((response) => {
        setAllCafes(response.data);  // Store all cafes
        setCafes(response.data);     // Initially display all cafes
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cafes:', error);
        setIsLoading(false);
      });
  };

  // Filter cafes based on searchLocation input
  const handleSearch = () => {
    if (searchLocation.trim() === '') {
      setCafes(allCafes);  // If search is empty, show all cafes
    } else {
      const filteredCafes = allCafes.filter((cafe) =>
        cafe.location.toLowerCase().includes(searchLocation.toLowerCase())  // Case-insensitive filter
      );
      setCafes(filteredCafes);
    }
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      cellRendererFramework: (params) => params.value.slice(0, 3) + '...',
      tooltipField: 'id'  // Show full value on hover
    },
    { 
      field: 'logo', 
      headerName: 'Logo', 
      cellRenderer: (params) => {
        const logoBase64 = params.value;  // Assuming value is a base64 string without any URL
        const logoSrc = `data:image/png;base64,${logoBase64}`;  // Construct proper image src
  
        return (
          <img 
            src={logoSrc} 
            alt="Cafe Logo" 
            style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }}
            title="Click to enlarge"
            onClick={() => window.open(logoSrc, '_blank')}  // Open image in new tab when clicked
          />
        );
      },
      tooltipField: 'logo'  // Show the base64 string on hover
    },
    { 
      field: 'name', 
      headerName: 'Cafe Name', 
      width: 150,
      tooltipField: 'name'  // Show full name on hover
    },
    { 
      field: 'location', 
      headerName: 'Location', 
      width: 150,
      tooltipField: 'location'  // Show full location on hover
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 300,
      tooltipField: 'description'  // Show full description on hover
    },
    {
      field: 'employees_count',
      headerName: 'Employees',
      width: 120,
      cellRenderer: (params) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate({
            to: '/employees',
            search: { cafe: params.data.name },  
          })}
        >
          {params.value} employee{params.value > 1 ? 's' : ''}
        </span>
      ),
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params) => (
        <ActionButtons
          item={params.data}
          onEdit={editCafe}  
          onDelete={confirmDeleteCafe} 
          idField="id"
        />
      ),
    },
  ];
  const editCafe = (id) => {
    navigate({ to: '/cafes/form', search: { id } }); // Navigate to form with id in query
  };

  const confirmDeleteCafe = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this cafe?');
    if (confirmed) {
      deleteCafe(id);
    }
  };

  const deleteCafe = (id) => {
    axios
      .delete(`http://localhost:5001/cafe/${id}`)
      .then(() => {
        setCafes(cafes.filter((cafe) => cafe.id !== id));
      })
      .catch((error) => {
        alert(`Error deleting cafe: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Cafe Explorer</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}  // Set search input
          style={{ padding: '10px', borderRadius: '5px', width: '300px' }}
        />
        <Button onClick={handleSearch} variant="contained" color="primary" style={{ padding: '10px' }}>
          SEARCH
        </Button>
        <Button onClick={() => navigate({ to: '/cafes/form' })} variant="contained" color="secondary" style={{ padding: '10px' }}>
          + ADD NEW CAFE
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact rowData={cafes} columnDefs={columns} pagination={true} paginationPageSize={10} />
      </div>
    </div>
  );
};

export default CafesPage;