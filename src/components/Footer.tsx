import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.primary.main,
                color: 'white',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Transport Booking
                        </Typography>
                        <Typography variant="body2">
                            Your one-stop solution for all your transportation needs.
                            Book trains, flights, and buses with ease.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Link href="/" color="inherit" underline="hover" sx={{ mb: 1 }}>
                                Home
                            </Link>
                            <Link href="/bookings" color="inherit" underline="hover" sx={{ mb: 1 }}>
                                My Bookings
                            </Link>
                            <Link href="/about" color="inherit" underline="hover" sx={{ mb: 1 }}>
                                About Us
                            </Link>
                            <Link href="/contact" color="inherit" underline="hover">
                                Contact
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Connect With Us
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Link href="#" color="inherit">
                                <Facebook />
                            </Link>
                            <Link href="#" color="inherit">
                                <Twitter />
                            </Link>
                            <Link href="#" color="inherit">
                                <Instagram />
                            </Link>
                            <Link href="#" color="inherit">
                                <LinkedIn />
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="body2" align="center">
                        © {new Date().getFullYear()} Transport Booking. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 