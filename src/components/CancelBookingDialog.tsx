import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
} from '@mui/material';
import { bookingService } from '../services/api';

interface CancelBookingDialogProps {
    open: boolean;
    onClose: () => void;
    bookingId: string;
    onSuccess: () => void;
}

const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
    open,
    onClose,
    bookingId,
    onSuccess
}) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleCancelBooking = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await bookingService.cancelBooking(bookingId);
            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to cancel booking. Please try again.');
            console.error('Cancellation error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to cancel this booking? This action cannot be undone.
                </DialogContentText>
                {error && (
                    <DialogContentText color="error" sx={{ mt: 2 }}>
                        {error}
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose} 
                    color="primary"
                    disabled={loading}
                >
                    No, Keep Booking
                </Button>
                <Button
                    onClick={handleCancelBooking}
                    color="error"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Yes, Cancel Booking'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelBookingDialog; 