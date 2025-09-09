import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  route: string;
  from: string;
  to: string;
  type: string;
  ticket: string;
  price: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  numberOfTickets: number;
  totalAmount: number;
}

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await import('../../services/api').then(m => m.adminService.getAllBookings());
      const mapped = data.map((booking: any) => ({
        id: booking.id,
        userName: booking.user?.username || booking.user?.email || '',
        userId: booking.user?.id || '',
        route: booking.transport?.name || '',
        from: booking.transport?.from || '',
        to: booking.transport?.to || '',
        type: booking.transport?.type || '',
        ticket: booking.ticketDetails?.name || '',
        price: booking.ticketDetails?.price || booking.transport?.price || 0,
        status: booking.status,
        bookingDate: booking.bookingDate,
        numberOfTickets: booking.numberOfTickets,
        totalAmount: booking.totalAmount,
      }));
      setBookings(mapped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="h5">Booking History</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Ticket</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.userName}</TableCell>
                <TableCell>{booking.from} → {booking.to}</TableCell>
                <TableCell>{booking.ticket}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{booking.totalAmount}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewDetails(booking)}
                    color="primary"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedBooking && (
          <>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  User Information
                </Typography>
                <Typography>Name: {selectedBooking.userName}</Typography>
                <Typography>User ID: {selectedBooking.userId}</Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Route Information
                </Typography>
                <Typography>From: {selectedBooking.from}</Typography>
                <Typography>To: {selectedBooking.to}</Typography>
                <Typography>
                  {/* Departure: {new Date(selectedBooking.routeDetails.departureTime).toLocaleString()} */}
                </Typography>
                <Typography>
                  {/* Arrival: {new Date(selectedBooking.routeDetails.arrivalTime).toLocaleString()} */}
                </Typography>
                <Typography>Transport Type: {selectedBooking.type}</Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Ticket Information
                </Typography>
                <Typography>Ticket Type: {selectedBooking.ticket}</Typography>
                <Typography>Price per Ticket: ₹{selectedBooking.price}</Typography>
                <Typography>Number of Tickets: {selectedBooking.numberOfTickets}</Typography>
                <Typography>Total Amount: ₹{selectedBooking.totalAmount}</Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Booking Information
                </Typography>
                <Typography>Booking ID: {selectedBooking.id}</Typography>
                <Typography>
                  Booking Date: {new Date(selectedBooking.bookingDate).toLocaleString()}
                </Typography>
                <Typography>
                  Status:{' '}
                  <Chip
                    label={selectedBooking.status}
                    color={getStatusColor(selectedBooking.status)}
                    size="small"
                  />
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default BookingHistory; 