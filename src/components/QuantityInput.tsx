import React from 'react'
import { IconButton, TextField, Box } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        size="small"
      >
        <Remove />
      </IconButton>
      <TextField
        type="number"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        inputProps={{
          min,
          max,
          style: { textAlign: 'center', width: 60 },
        }}
        size="small"
      />
      <IconButton
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        size="small"
      >
        <Add />
      </IconButton>
    </Box>
  )
}

