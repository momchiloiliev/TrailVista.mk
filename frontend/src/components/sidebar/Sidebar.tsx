import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Typography, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './Sidebar.scss';

const trails = [
    { name: "Trail 1", description: "A beautiful trail through the forest." },
    { name: "Trail 2", description: "A scenic trail by the river." },
    { name: "Trail 3", description: "A challenging trail up the mountain." },
    // Add more trails as needed
];

const Sidebar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTrails = trails.filter(trail =>
        trail.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box className="trail-sidebar">
            <Box className="search-container">
                <TextField
                    variant="outlined"
                    placeholder="Search For A Trail"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Box>
            <List className="trail-list">
                {filteredTrails.map((trail, index) => (
                    <ListItem key={index} className="trail-item">
                        <ListItemText
                            primary={<Typography variant="h6">{trail.name}</Typography>}
                            secondary={<Typography variant="body2">{trail.description}</Typography>}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
