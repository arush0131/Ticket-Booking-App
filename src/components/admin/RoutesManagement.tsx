import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { transportService } from '../../services/api';

interface Route {
  id: string;
  from: string;
  to: string;
  transportType: string;
  price: number;
  availableSeats: number;
}

const RoutesManagement: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    transportType: '',
    price: '',
    availableSeats: '',
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await transportService.getAdminTransports();
      console.log('Raw fetched routes:', data);
      // Ensure we're setting the routes with the correct data structure
      const formattedRoutes = data.map((route: any) => ({
        id: route._id || route.id,
        name: route.name,
        type: route.type,
        from: route.from,
        to: route.to,
        price: route.price,
        seats: route.seats,
        availableSeats: route.availableSeats,
        departureTime: route.departureTime,
        arrivalTime: route.arrivalTime
      }));
      console.log('Formatted routes:', formattedRoutes);
      setRoutes(formattedRoutes);
    } catch (error: any) {
      console.error('Error fetching routes:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleOpen = (route?: Route) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        from: route.from,
        to: route.to,
        transportType: route.transportType,
        price: route.price.toString(),
        availableSeats: route.availableSeats.toString(),
      });
    } else {
      setEditingRoute(null);
      setFormData({
        from: '',
        to: '',
        transportType: '',
        price: '',
        availableSeats: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRoute(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const seats = parseInt(formData.availableSeats);
      const transportData = {
        name: `${formData.from} to ${formData.to}`,
        type: formData.transportType as 'bus' | 'train' | 'flight',
        from: formData.from,
        to: formData.to,
        price: parseFloat(formData.price),
        seats: seats,
        availableSeats: seats
      };

      console.log('Sending transport data:', transportData);

      if (editingRoute) {
        const response = await transportService.updateTransport(editingRoute.id, transportData);
        console.log('Update response:', response);
      } else {
        const response = await transportService.addTransport(transportData);
        console.log('Add response:', response);
      }
      
      fetchRoutes();
      handleClose();
    } catch (error: any) {
      console.error('Error saving route:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        const response = await transportService.deleteTransport(id);
        console.log('Delete response:', response);
        fetchRoutes();
      } catch (error: any) {
        console.error('Error deleting route:', error);
        let errorMessage = 'Failed to delete route';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        alert(errorMessage);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Manage Routes</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add New Route
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Transport Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Available Seats</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>{route.from}</TableCell>
                <TableCell>{route.to}</TableCell>
                <TableCell>{route.transportType}</TableCell>
                <TableCell>₹{route.price}</TableCell>
                <TableCell>{route.availableSeats}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(route)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(route.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>
          {editingRoute ? 'Edit Route' : 'Add New Route'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="From"
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="To"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Transport Type</InputLabel>
              <Select
                value={formData.transportType}
                onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                required
              >
                <MenuItem value="bus">Bus</MenuItem>
                <MenuItem value="train">Train</MenuItem>
                <MenuItem value="flight">Plane</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Available Seats"
              type="number"
              value={formData.availableSeats}
              onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingRoute ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default RoutesManagement; 