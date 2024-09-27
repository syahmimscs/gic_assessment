import React from 'react';
import { Button } from '@mui/material';

const ActionButtons = ({ item, onEdit, onDelete, idField }) => {
  const handleEdit = () => {
    onEdit(item[idField]);
  };

  const handleDelete = () => {
    onDelete(item[idField]);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleEdit}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};

export default ActionButtons;