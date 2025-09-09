import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import CancelBookingDialog from '../components/CancelBookingDialog';
import { Booking } from '../types';

const Bookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await bookingService.getBookings();
            // Map backend fields to expected frontend fields
            const mapped = data.map((booking: any) => ({
                id: booking.id || booking._id,
                type: booking.transport?.type || 'Unknown',
                date: booking.bookingDate || booking.date,
                passengers: booking.numberOfTickets || booking.passengers,
                status: booking.status,
                route: booking.transport
                    ? `${booking.transport.from} → ${booking.transport.to}`
                    : 'Unknown',
            }));
            setBookings(mapped);
        } catch (err) {
            setError('Failed to fetch bookings');
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setCancelDialogOpen(true);
    };

    const handleCancelSuccess = () => {
        fetchBookings();
    };

    if (!user) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="info">
                    Please log in to view your bookings.
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {bookings.length === 0 ? (
                <Alert severity="info">
                    You have no bookings yet.
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {bookings.map((booking) => (
                        <Grid item xs={12} sm={6} md={4} key={booking.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {booking.route || 'Unknown Route'}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        Booking ID: {booking.id}
                                    </Typography>
                                    <Typography>
                                        Date: {booking.date ? new Date(booking.date).toLocaleDateString() : 'Unknown'}
                                    </Typography>
                                    <Typography>
                                        Passengers: {booking.passengers}
                                    </Typography>
                                    <Typography>
                                        Status: {booking.status}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {booking.status === 'confirmed' && (
                                        <Button
                                            color="error"
                                            onClick={() => handleCancelClick(booking)}
                                        >
                                            Cancel Booking
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <CancelBookingDialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                bookingId={selectedBooking?.id || ''}
                onSuccess={handleCancelSuccess}
            />
        </Container>
    );
};

export default Bookings; 