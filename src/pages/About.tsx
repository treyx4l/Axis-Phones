import React from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Link,
  Divider,
} from '@mui/material'
import { Code, Email, GitHub, LinkedIn } from '@mui/icons-material'

export const About: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '3rem',
            }}
          >
            <Code sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h3" component="h1" gutterBottom>
            About the Developer
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Full-Stack Developer & UI/UX Enthusiast
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          About This Project
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          AxisPhones is a modern, responsive e-commerce platform built with React, TypeScript, and Material-UI.
          This application demonstrates best practices in frontend development, including state management,
          authentication, and user experience design.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Technologies Used
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              • React 18 with TypeScript
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Material-UI (MUI) v5
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Firebase Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • React Router v6
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              • Vite Build Tool
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Context API for State Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Jest & React Testing Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Paystack Payment Integration
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Features
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            User authentication with Google OAuth
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Product catalog with search and filtering
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Shopping cart with persistent storage
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Checkout flow with payment integration
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Admin dashboard for product management
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Dark and light theme support
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Responsive design for all devices
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Connect with the Developer
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Link
              href="mailto:developer@axisphones.com"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Email /> Email
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <GitHub /> GitHub
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <LinkedIn /> LinkedIn
            </Link>
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 AxisPhones. Built with ❤️ by a passionate developer.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

