import React from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
} from '@mui/material'

export const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Terms of Service
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          1. Agreement to Terms
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          By accessing or using the AxisPhones website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          2. Use License
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Permission is granted to temporarily access the materials on AxisPhones' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Modify or copy the materials
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Use the materials for any commercial purpose or for any public display
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Attempt to reverse engineer any software contained on the website
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            Remove any copyright or other proprietary notations from the materials
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          3. User Accounts
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          4. Products and Pricing
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We reserve the right to change prices and product availability at any time. All prices are in the currency displayed and are subject to change without notice. We strive to provide accurate product descriptions and images, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          5. Payment Terms
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Payment must be received before we ship your order. We accept various payment methods as displayed during checkout. By providing payment information, you represent and warrant that you have the legal right to use the payment method provided.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          6. Shipping and Delivery
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We will make every effort to ship your order within the timeframe specified. However, we are not responsible for delays caused by shipping carriers or circumstances beyond our control. Risk of loss and title for products pass to you upon delivery to the carrier.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          7. Returns and Refunds
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Our return and refund policy is available on our website. Products must be returned in their original condition within the specified return period. Refunds will be processed according to our refund policy.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          8. Prohibited Uses
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          You agree not to use the website:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            In any way that violates any applicable law or regulation
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            To transmit any malicious code or viruses
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            To attempt to gain unauthorized access to any portion of the website
          </Typography>
          <Typography component="li" variant="body1" color="text.secondary" paragraph>
            To interfere with or disrupt the website or servers
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          9. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          The website and its original content, features, and functionality are owned by AxisPhones and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          10. Disclaimer
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          The materials on AxisPhones' website are provided on an 'as is' basis. AxisPhones makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          11. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          In no event shall AxisPhones or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AxisPhones' website.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          12. Indemnification
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          You agree to defend, indemnify, and hold harmless AxisPhones and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the website or violation of these Terms.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          13. Governing Law
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          14. Changes to Terms
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          15. Contact Information
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          If you have any questions about these Terms of Service, please contact us at:
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Email: legal@axisphones.com
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Support: support@axisphones.com
        </Typography>
      </Paper>
    </Container>
  )
}

