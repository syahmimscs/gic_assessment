import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const EmployeeForm = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhoneNumber, setEmployeePhoneNumber] = useState('');
  const [employeeGender, setEmployeeGender] = useState(''); // Ensure this starts as an empty string
  const [employeeCafeId, setEmployeeCafeId] = useState(''); // Store the cafe ID instead of name
  const [cafes, setCafes] = useState([]);
  const [isDirty, setIsDirty] = useState(false); // Track unsaved changes
  const [errors, setErrors] = useState({}); // Track validation errors

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch cafes first, then employee details
  useEffect(() => {
    fetchCafes();
  }, []);

  useEffect(() => {
    if (cafes.length > 0) {
      const params = new URLSearchParams(location.search);
      const employeeIdFromQuery = params.get('id');
      if (employeeIdFromQuery) {
        fetchEmployeeDetails(employeeIdFromQuery);
      }
    }
  }, [cafes, location.search]);

  const fetchEmployeeDetails = (id) => {
    axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}:5001/employee/${id}`)
      .then(response => {
        const employee = response.data;
        setEmployeeId(employee.id);
        setEmployeeName(employee.name);
        setEmployeeEmail(employee.email_address);
        setEmployeePhoneNumber(employee.phone_number);
        setEmployeeGender(employee.gender || ''); // Set gender field
        // Find the corresponding cafe ID from cafes list
        const selectedCafe = cafes.find(cafe => cafe.name === employee.cafe);
        setEmployeeCafeId(selectedCafe ? selectedCafe.id : '');
      })
      .catch(error => console.error('Error fetching employee:', error));
  };

  const fetchCafes = () => {
    axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}:5001/cafes`)
      .then(response => {
        setCafes(response.data); // Assuming the response is an array of cafes
      })
      .catch(error => console.error('Error fetching cafes:', error));
  };

  const validateFields = () => {
    const newErrors = {};
    if (employeeName.length < 6 || employeeName.length > 10) {
      newErrors.employeeName = "Name must be between 6 and 10 characters.";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(employeeEmail)) {
      newErrors.employeeEmail = "Invalid email format.";
    }
    const phonePattern = /^(8|9)\d{7}$/; // Starts with 8 or 9, followed by 7 digits
    if (!phonePattern.test(employeePhoneNumber)) {
      newErrors.employeePhoneNumber = "Invalid phone number. Must start with 8 or 9 and have 8 digits.";
    }
    return newErrors;
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsDirty(true); // Mark form as dirty when input changes
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const employeeData = {
      id: employeeId,
      name: employeeName,
      email_address: employeeEmail,
      phone_number: employeePhoneNumber,
      gender: employeeGender,
      cafe_id: employeeCafeId, // Send cafe_id instead of cafe name
    };

    if (employeeId) {
      handleUpdateEmployee(employeeData);
    } else {
      handleAddEmployee(employeeData);
    }
  };

  const handleUpdateEmployee = (data) => {
    axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}:5001/employee/${employeeId}`, data)
      .then(() => {
        navigate({ to: '/employees' }); // Go back to the employees page after saving
      })
      .catch(error => {
        console.error('Error updating employee:', error);
      });
  };

  const handleAddEmployee = (data) => {
    axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}:5001/employee`, data)
      .then(() => {
        navigate({ to: '/employees' });
      })
      .catch(error => {
        console.error('Error adding employee:', error);
      });
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (confirmLeave) {
        navigate({ to: '/employees' }); // Redirect to employees page
      }
    } else {
      navigate({ to: '/employees' }); // Redirect to employees page
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '500px',
        margin: 'auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      <h2 style={{ color: '#333' }}>{employeeId ? 'Edit Employee' : 'Add Employee'}</h2>

      <TextField
        label="Name"
        value={employeeName}
        onChange={handleInputChange(setEmployeeName)}
        fullWidth
        margin="normal"
        error={!!errors.employeeName}
        helperText={errors.employeeName}
        InputProps={{ style: { backgroundColor: 'white' } }} // Make input white
      />
      <TextField
        label="Email"
        value={employeeEmail}
        onChange={handleInputChange(setEmployeeEmail)}
        fullWidth
        margin="normal"
        error={!!errors.employeeEmail}
        helperText={errors.employeeEmail}
        InputProps={{ style: { backgroundColor: 'white' } }} // Make input white
      />
      <TextField
        label="Phone Number"
        value={employeePhoneNumber}
        onChange={handleInputChange(setEmployeePhoneNumber)}
        fullWidth
        margin="normal"
        error={!!errors.employeePhoneNumber}
        helperText={errors.employeePhoneNumber}
        InputProps={{ style: { backgroundColor: 'white' } }} // Make input white
      />

      <FormControl component="fieldset" margin="normal">
        <RadioGroup
          row
          value={employeeGender}
          onChange={handleInputChange(setEmployeeGender)}
        >
          <FormControlLabel value="Male" control={<Radio />} label="Male" style={{ color: 'black' }} />
          <FormControlLabel value="Female" control={<Radio />} label="Female" style={{ color: 'black' }} />
        </RadioGroup>
      </FormControl>

      {/* Cafe Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Cafe</InputLabel>
        <Select
          value={employeeCafeId}
          onChange={handleInputChange(setEmployeeCafeId)} // Set the cafe ID
          displayEmpty
          inputProps={{ 'aria-label': 'Cafe' }}
        >
          <MenuItem value="">
            <em>Select Cafe</em>
          </MenuItem>
          {cafes.map(cafe => (
            <MenuItem key={cafe.id} value={cafe.id}>{cafe.name}</MenuItem> // Use cafe.id
          ))}
        </Select>
      </FormControl>

      <div style={{ marginTop: '20px' }}>
        <Button type="submit" variant="contained" color="primary">
          {employeeId ? 'Update Employee' : 'Add Employee'}
        </Button>
        <Button
          variant="text"
          onClick={handleCancel}
          style={{ marginLeft: '10px', color: 'blue' }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;