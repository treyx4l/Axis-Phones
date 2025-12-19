import React from 'react'
import { Box, Tooltip } from '@mui/material'
import { ColorVariant } from '../types'

interface ColorSwatchProps {
  color: ColorVariant
  selected?: boolean
  onClick?: () => void
  size?: number | string
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  selected = false,
  onClick,
  size = 32,
}) => {
  return (
    <Tooltip title={color.name}>
      <Box
        onClick={onClick}
        sx={{
          width: typeof size === 'number' ? size : '100%',
          height: typeof size === 'number' ? size : '100%',
          maxWidth: typeof size === 'number' ? size : '100%',
          maxHeight: typeof size === 'number' ? size : '100%',
          borderRadius: '50%',
          backgroundColor: color.hex,
          border: selected ? '3px solid' : '2px solid',
          borderColor: selected ? 'primary.main' : 'divider',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s',
          '&:hover': onClick
            ? {
                transform: 'scale(1.1)',
                borderColor: 'primary.main',
              }
            : {},
        }}
      />
    </Tooltip>
  )
}

