import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';

const Timer = ({ initialMinutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLowTime = secondsLeft < 300; // Less than 5 mins

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        icon={<TimerIcon />}
        label={`Time Remaining: ${formattedTime}`}
        color={isLowTime ? 'error' : 'primary'}
        variant="filled"
        sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}
      />
    </Box>
  );
};

export default Timer;
