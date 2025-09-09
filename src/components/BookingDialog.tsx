import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Alert,
    CircularProgress,
    DialogContentText
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';

interface BookingDialogProps {
    open: boolean;
    onClose: () => void;
    transport: {
        id: string;
        name: string;
        type: string;
        from: string;
        to: string;
        price: number;
        availableSeats: number;
    };
    onBookingSuccess: () => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
    open,
    onClose,
    transport,
    onBookingSuccess
}) => {
    const [passengers, setPassengers] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { user } = useAuth();

    // Reset state when dialog opens or transport changes
    useEffect(() => {
        if (open) {
            setPassengers(1);
            setError(null);
            setLoading(false);
            setShowConfirmation(false);
        }
    }, [open, transport]);

    const handlePassengersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= transport.availableSeats) {
            setPassengers(value);
        }
    };

    const handleBooking = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const bookingData = {
                transportId: transport.id,
                passengers: passengers
            };
            console.log('Sending booking data:', bookingData);
            
            const response = await bookingService.createBooking(bookingData);
            console.log('Booking response:', response);
            
            onBookingSuccess();
            onClose();
        } catch (err: any) {
            console.error('Booking error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowConfirmation(true);
    };

    const handleConfirmCancel = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await bookingService.cancelBooking(transport.id);
            onBookingSuccess();
            onClose();
        } catch (err) {
            setError('Failed to cancel booking. Please try again.');
            console.error('Cancellation error:', err);
        } finally {
            setLoading(false);
            setShowConfirmation(false);
        }
    };

    const totalPrice = transport.price * passengers;

    return (
        <>
            <Dialog 
                open={open} 
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    py: 2
                }}>
                    <Typography variant="h6" component="div">Book Your Journey</Typography>
                </DialogTitle>
                
                <DialogContent sx={{ py: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {transport.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {transport.from} → {transport.to}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Available Seats: {transport.availableSeats}
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            label="Number of Passengers"
                            value={passengers}
                            onChange={handlePassengersChange}
                            inputProps={{
                                min: 1,
                                max: transport.availableSeats
                            }}
                            sx={{ mt: 2 }}
                        />
                    </Box>

                    <Box sx={{ 
                        bgcolor: 'grey.50', 
                        p: 2, 
                        borderRadius: 1,
                        mb: 2
                    }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Price Details
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Base Price</Typography>
                            <Typography variant="body2">₹{transport.price}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Passengers</Typography>
                            <Typography variant="body2">x {passengers}</Typography>
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            pt: 1,
                            mt: 1
                        }}>
                            <Typography variant="subtitle1">Total</Typography>
                            <Typography variant="subtitle1" color="primary">
                                ₹{totalPrice}
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions sx={{ 
                    px: 3, 
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button 
                        onClick={handleCancel}
                        sx={{ 
                            mr: 1,
                            color: 'text.secondary'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleBooking}
                        disabled={loading || passengers > transport.availableSeats}
                        sx={{
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark'
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Confirm Booking'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showConfirmation}
                onClose={() => setShowConfirmation(false)}
            >
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this booking? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmation(false)} color="primary">
                        No, Keep Booking
                    </Button>
                    <Button onClick={handleConfirmCancel} color="error" variant="contained">
                        Yes, Cancel Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookingDialog; 