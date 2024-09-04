import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Typography, TextField, Card, CardContent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import './Sidebar.scss';

interface Trail {
    id: number;
    title: string;
    description: string;
    moderation_status: string;
}

const Sidebar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [trails, setTrails] = useState<Trail[]>([]); // State to hold the list of trails

    // Fetch trails from the backend
    useEffect(() => {
        const fetchTrails = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/posts'); // Adjust the endpoint if needed

                // Log the full response to see its structure
                console.log('API response:', response);

                // Map over the array in response.data.data
                setTrails(response.data.data.map((post: any) => ({
                    id: post.id,
                    title: post.title ?? 'Unnamed Trail', // Use 'Unnamed Trail' if title is null
                    description: post.description ?? 'No description provided', // Handle empty descriptions
                    moderation_status: post.moderation_status,
                })));
            } catch (error) {
                console.error('Error fetching trails:', error);
            }
        };

        fetchTrails();
    }, []);

    // Filter trails based on the search term
    const filteredTrails = trails.filter(trail =>
        trail.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                {filteredTrails.map((trail) => (
                    <Card key={trail.id} className="trail-card">
                        <CardContent>
                            <ListItem className="trail-item">
                                <div className="trail-mod-status">
                                    {trail.moderation_status}
                                </div>
                                <ListItemText
                                    primary={<Typography variant="h6">{trail.title}</Typography>}
                                    secondary={<Typography variant="body2" color='black'>{trail.description}</Typography>}
                                />
                            </ListItem>
                        </CardContent>
                    </Card>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
