import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpIcon from '@mui/icons-material/Help';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work'; // New icon for Jobs
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // New icon for Running
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // New icon for Completed
import FolderIcon from '@mui/icons-material/Folder';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { Link } from 'react-router-dom'; // Import Link

const TopTabs = () => {
    const [value, setValue] = useState(0); // State to manage selected tab

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, link: '/' },
        { text: 'My Work', icon: <CheckBoxIcon />, link: '/my-work' },
        { text: 'Dashboards', icon: <DashboardIcon />, link: '/dashboards' },
        { text: 'Help', icon: <HelpIcon />, link: '/help' },
        { text: 'Requests', icon: <CalendarTodayIcon />, link: '/requests' },
        { text: 'Jobs', icon: <WorkIcon />, link: '/jobs' },
        { text: 'Running', icon: <PlayArrowIcon />, link: '/jobs/running' },
        { text: 'Completed', icon: <CheckCircleIcon />, link: '/jobs/completed' },
        { text: 'Portfolios', icon: <FolderIcon />, link: '/portfolios' },
        { text: 'Programs', icon: <DeviceHubIcon />, link: '/programs' }
    ];

    return (
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #0076CE, #005A99)', color: '#ffffff', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="navigation tabs" 
                    sx={{ color: '#ffffff', flexWrap: 'wrap' }}
                >
                    {menuItems.map((item, index) => (
                        <Tab 
                            key={index}
                            label={
                                <>
                                    {item.icon}
                                    <Box sx={{ ml: 1 }}>{item.text}</Box>
                                </>
                            } 
                            component={Link} 
                            to={item.link} 
                            aria-label={item.text}
                            sx={{ color: '#ffffff' }}
                        />
                    ))}
                </Tabs>
            </Box>
        </AppBar>
    );
}

export default TopTabs;


