import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Typography, TextField, Card, CardContent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import './Sidebar.scss';
import { FiClock } from "react-icons/fi";
import { GiPathDistance } from "react-icons/gi";
import { GoArrowUpRight } from "react-icons/go";

interface Trail {
    id: number;
    title: string;
    description: string;
    moderation_status: string;
    sport: string;
    time: string;
    distance: number;  // Ensure distance is a number
    elevation: number; // Ensure elevation is a number
}

const Sidebar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [trails, setTrails] = useState<Trail[]>([]); // State to hold the list of trails

    // Fetch trails from the backend
    useEffect(() => {
        const fetchTrails = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/posts'); // Adjust the endpoint if needed

                // Map over the array in response.data.data
                setTrails(response.data.data.map((post: any) => ({
                    id: post.id,
                    title: post.title ?? 'Unnamed Trail', // Use 'Unnamed Trail' if title is null
                    description: post.description ?? 'No description provided', // Handle empty descriptions
                    moderation_status: post.moderation_status,
                    sport: post.sport,
                    time: post.time,
                    distance: post.distance ? parseFloat(post.distance) : 0, // Convert to float if exists
                    elevation: post.elevation ? parseFloat(post.elevation) : 0, // Convert to float if exists
                })));
            } catch (error) {
                console.error('Error fetching trails:', error);
            }
        };

        fetchTrails();
    }, []);

    // Function to format time from HH:MM:SS to Xh Ymin
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return `${hours > 0 ? `${hours}h ` : ''}${minutes}min`;
    };

    // Function to format distance to x.xx km
    const formatDistance = (distance: number) => {
        return distance.toFixed(2); // Format distance to 2 decimal places
    };

    const formatElevation = (elevation: number) => {
        return elevation.toFixed(2); // Format elevation to 2 decimal places
    };

    // Function to determine moderation color
    const getModerationColor = (moderationStatus: string) => {
        switch (moderationStatus) {
            case 'easy':
                return '#7dcc67'; // Green for 'easy'
            case 'medium':
                return 'orange';  // Orange for 'medium'
            case 'hard':
                return 'red';     // Red for 'hard'
            case 'extreme':
                return 'black';   // Black for 'extreme'
            default:
                return '#7dcc67'; // Default color
        }
    };

    // Filter and sort trails based on the search term and sort alphabetically by title
    const filteredTrails = trails
        .filter(trail => trail.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title)); // Sort by title A-Z

    return (
        <Box className="trail-sidebar" width={420}>
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
                                <div className="status-activity-container">
                                    <div className="trail-mod-status" style={{
                                        backgroundColor: getModerationColor(trail.moderation_status),
                                    }}>
                                        {trail.moderation_status}
                                    </div>
                                    <div className="trail-activity">
                                        {trail.sport}
                                    </div>
                                </div>
                                <div>
                                    <p className="sidebar-title">{trail.title}</p>
                                    <p className="sidebar-description">{trail.description}</p>
                                </div>
                                <div className="trail-time-distance-elevation">
                                    <div>
                                        <strong><FiClock /></strong>
                                    </div>
                                    <div className="icons">
                                        {formatTime(trail.time)}
                                    </div>
                                    <div>
                                        <strong><GiPathDistance /> </strong>
                                    </div>
                                    <div className="icons">
                                        {formatDistance(trail.distance)} km
                                    </div>
                                    <div>
                                        <strong><GoArrowUpRight /> </strong>
                                    </div>
                                    <div className="icons">
                                        {formatElevation(trail.elevation)} m
                                    </div>
                                </div>
                            </ListItem>
                        </CardContent>
                    </Card>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
