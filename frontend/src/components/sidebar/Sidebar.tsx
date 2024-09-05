import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

interface Trail {
    id: number;
    title: string;
    description: string;
    file_path: string; // Include file path for GPX
    moderation_status: string;
}

interface SidebarProps {
    onTrailSelect: (gpxFile: string) => void; // Callback to select a trail
}

const Sidebar: React.FC<SidebarProps> = ({ onTrailSelect }) => {
    const [trails, setTrails] = useState<Trail[]>([]); // State to hold the list of trails

    // Fetch trails from the backend
    useEffect(() => {
        const fetchTrails = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/posts'); // Adjust the endpoint if needed
                setTrails(response.data.data);

                // Automatically select the first trail's GPX file on load
                if (response.data.data.length > 0) {
                    onTrailSelect(response.data.data[0].file_path); // Load the first trail's GPX file
                }
            } catch (error) {
                console.error('Error fetching trails:', error);
            }
        };

        fetchTrails();
    }, []);

    return (
        <Box className="trail-sidebar">
            <List className="trail-list">
                {trails.map((trail) => (
                    <Card key={trail.id} className="trail-card" onClick={() => onTrailSelect(trail.file_path)}>
                        <CardContent>
                            <ListItem className="trail-item">
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
