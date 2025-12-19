import React from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
} from '@mui/material'

export const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          1. Introduction
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Welcome to AxisPhones. We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          2. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We collect information that you provide directly to us, including:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Personal information such as your name, email address, phone number, and shipping address when you create an account or make a purchase
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Payment information (processed securely through third-party payment processors)
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Profile information including profile pictures and display names
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Order history and transaction records
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          3. How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We use the information we collect to:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Process and fulfill your orders
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Communicate with you about your orders, products, services, and promotional offers
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Improve our website and customer service
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Send you marketing communications (with your consent)
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Detect and prevent fraud and abuse
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          4. Information Sharing and Disclosure
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We do not sell your personal information. We may share your information with:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Service providers who assist us in operating our website and conducting our business
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Payment processors to handle transactions
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Law enforcement or government agencies when required by law
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          5. Data Security
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          6. Your Rights
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          You have the right to:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Access and update your personal information through your account settings
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Request deletion of your personal data
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Opt-out of marketing communications
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Request a copy of your data
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          7. Cookies and Tracking Technologies
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          8. Third-Party Services
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Our website uses third-party services including Firebase for authentication and storage, and payment processors for transactions. These services have their own privacy policies.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          9. Children's Privacy
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          10. Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          11. Contact Us
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          If you have any questions about this Privacy Policy, please contact us at:
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Email: privacy@axisphones.com
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Support: support@axisphones.com
        </Typography>
      </Paper>
    </Container>
  )
}

