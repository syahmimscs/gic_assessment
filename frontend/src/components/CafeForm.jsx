import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Button, TextField } from '@mui/material';

const CafeForm = () => {
  const [cafeId, setCafeId] = useState(null);
  const [cafeName, setCafeName] = useState('');
  const [cafeLocation, setCafeLocation] = useState('');
  const [cafeDescription, setCafeDescription] = useState('');
  const [cafeLogo, setCafeLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // For prefilled logo and preview of new uploads
  const [isDirty, setIsDirty] = useState(false); // Track unsaved changes
  const [errors, setErrors] = useState({}); // Track validation errors

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch cafe details if editing
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cafeIdFromQuery = params.get('id');
    if (cafeIdFromQuery) {
      fetchCafeDetails(cafeIdFromQuery);
    }
  }, [location.search]);

  const fetchCafeDetails = (id) => {
    axios.get(`http://localhost:5001/cafe/${id}`)
      .then(response => {
        const cafe = response.data;
        setCafeId(cafe.id);
        setCafeName(cafe.name);
        setCafeLocation(cafe.location);
        setCafeDescription(cafe.description);
        // Convert base64 to image URL for preview
        setPreviewUrl(`data:image/png;base64,${cafe.logo}`);  // Display the existing logo
      })
      .catch(error => console.error('Error fetching cafe:', error));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB");
        return;
      }
      setCafeLogo(file); // Store the selected file in state

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Preview the selected image
      };
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (cafeName.length < 6 || cafeName.length > 10) {
      newErrors.cafeName = "Cafe Name must be between 6 and 10 characters.";
    }
    if (cafeDescription.length > 256) {
      newErrors.cafeDescription = "Description must be 256 characters or less.";
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create FormData object to hold form data and file
    const formData = new FormData();
    formData.append('name', cafeName);
    formData.append('location', cafeLocation);
    formData.append('description', cafeDescription);
    if (cafeLogo) {
      formData.append('logo', cafeLogo);  // Append the logo file if provided
    }

    if (cafeId) {
      formData.append('id', cafeId);
      handleUpdateCafe(formData);  // Send FormData for updating
    } else {
      handleAddCafe(formData);  // Send FormData for adding
    }
  };

  const handleUpdateCafe = (formData) => {
    axios.put(`http://localhost:5001/cafe`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }  // Ensure correct content type
    })
    .then(() => {
      navigate({ to: '/cafes' }); // Redirect to the cafes page after saving
    })
    .catch(error => {
      console.error('Error updating cafe:', error);
    });
  };

  const handleAddCafe = (formData) => {
    axios.post('http://localhost:5001/cafe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }  // Ensure correct content type
    })
    .then(() => {
      navigate({ to: '/cafes' }); // Redirect to the cafes page after adding
    })
    .catch(error => {
      console.error('Error adding cafe:', error);
    });
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (confirmLeave) {
        navigate({ to: '/cafes' }); // Redirect to cafes page
      }
    } else {
      navigate({ to: '/cafes' }); // Redirect to cafes page
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
      <h2 style={{ color: '#333' }}>{cafeId ? 'Edit Cafe' : 'Add Cafe'}</h2>

      <TextField
        label="Cafe Name"
        value={cafeName}
        onChange={(e) => {
          setCafeName(e.target.value);
          setIsDirty(true);
        }}
        fullWidth
        margin="normal"
        error={!!errors.cafeName}
        helperText={errors.cafeName}
        InputProps={{ style: { backgroundColor: 'white' } }} // Make input white
      />
      <TextField
        label="Location"
        value={cafeLocation}
        onChange={(e) => {
          setCafeLocation(e.target.value);
          setIsDirty(true);
        }}
        fullWidth
        margin="normal"
        InputProps={{ style: { backgroundColor: 'white' } }} // Make input white
      />
      <TextField
        label="Description"
        value={cafeDescription}
        onChange={(e) => {
          setCafeDescription(e.target.value);
          setIsDirty(true);
        }}
        fullWidth
        margin="normal"
        error={!!errors.cafeDescription}
        helperText={errors.cafeDescription}
        InputProps={{ style: { backgroundColor: 'white' } }} // Make input white
      />

      {/* Logo Upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: '15px', marginBottom: '15px' }} />
      {previewUrl && <img src={previewUrl} alt="Cafe Logo" style={{ width: '100px', height: '100px', marginBottom: '15px' }} />}

      <div style={{ marginTop: '20px' }}>
        <Button type="submit" variant="contained" color="primary" style={{ padding: '10px' }}>
          {cafeId ? 'Update Cafe' : 'Add Cafe'}
        </Button>
        <Button
          onClick={handleCancel} // Use handleCancel for the button click
          variant="contained"
          color="secondary"
          style={{ marginLeft: '10px', padding: '10px' }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CafeForm;