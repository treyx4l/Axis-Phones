import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'

interface Notification {
  id: string
  message: string
  severity: AlertColor
  duration?: number
}

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor, duration?: number) => void
  showRateLimitError: (resetTime: number, operation: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)

  const showNotification = (
    message: string,
    severity: AlertColor = 'info',
    duration: number = 6000
  ) => {
    const id = Date.now().toString()
    const notification: Notification = { id, message, severity, duration }
    
    setCurrentNotification(notification)
    setOpen(true)

    // Auto close after duration
    setTimeout(() => {
      setOpen(false)
      setTimeout(() => {
        setCurrentNotification(null)
      }, 300) // Wait for fade out animation
    }, duration)
  }

  const showRateLimitError = (resetTime: number, operation: string) => {
    const timeUntilReset = Math.max(0, Math.ceil((resetTime - Date.now()) / 1000 / 60)) // minutes
    
    let message = `Rate limit exceeded for ${operation}. `
    
    if (timeUntilReset > 0) {
      if (timeUntilReset < 60) {
        message += `Please try again in ${timeUntilReset} minute${timeUntilReset > 1 ? 's' : ''}.`
      } else {
        const hours = Math.floor(timeUntilReset / 60)
        message += `Please try again in ${hours} hour${hours > 1 ? 's' : ''}.`
      }
    } else {
      message += 'Please try again shortly.'
    }
    
    showNotification(message, 'warning', 8000)
  }

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    setTimeout(() => {
      setCurrentNotification(null)
    }, 300)
  }

  return (
    <NotificationContext.Provider value={{ showNotification, showRateLimitError }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={currentNotification?.duration || 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {currentNotification ? (
          <Alert
            onClose={handleClose}
            severity={currentNotification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {currentNotification.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

