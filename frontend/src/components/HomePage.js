import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';

const HomePage = () => {
  const menuItems = [
    { text: 'Execution', path: '/execution' },
    { text: 'Scheduler', path: '/scheduler' },
    { text: 'Reports', path: '/reports' },  // Link to the Reports Page
  ];
 
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: 240, 
            boxSizing: 'border-box',
            backgroundColor: '#003366', // Dark Blue background color
            color: '#ffffff',           // White text color
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} component={Link} to={item.path}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: 240 }}
      >
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to the QA Dashboard. Please select an option from the menu.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
