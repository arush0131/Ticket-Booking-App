import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TicketsManagement from '../components/admin/TicketsManagement';
import RoutesManagement from '../components/admin/RoutesManagement';
import BookingHistory from '../components/admin/BookingHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage: React.FC = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // Add any initial data loading here
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="admin tabs"
            variant="fullWidth"
          >
            <Tab label="Tickets" />
            <Tab label="Routes" />
            <Tab label="Booking History" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <TicketsManagement />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RoutesManagement />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <BookingHistory />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminPage; 