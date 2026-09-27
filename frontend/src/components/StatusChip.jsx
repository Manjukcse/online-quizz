import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status }) => {
  let color = 'default';
  let label = status;

  switch (status) {
    case 'APPROVED':
    case 'PASS':
    case 'COMPLETED':
      color = 'success';
      break;
    case 'PENDING':
    case 'REGISTERED':
    case 'NOT_STARTED':
      color = 'warning';
      break;
    case 'REJECTED':
    case 'FAIL':
    case 'EXPIRED':
      color = 'error';
      break;
    case 'IN_PROGRESS':
      color = 'info';
      break;
    default:
      color = 'default';
  }

  return <Chip label={label} color={color} size="small" variant="outlined" />;
};

export default StatusChip;
