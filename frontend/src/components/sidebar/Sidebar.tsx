import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, IconButton, TextField, Card, CardContent } from '@mui/material';
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
    distance: number;
    elevation: number;
}

interface SidebarProps {
    onTrailSelect: (trailId: number) => void; // Function to handle trail selection by ID
}

const Sidebar: React.FC<SidebarProps> = ({ onTrailSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [trails, setTrails] = useState<Trail[]>([]);

    useEffect(() => {
        const fetchTrails = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/posts');
                setTrails(response.data.data.map((post: any) => ({
                    id: post.id,
                    title: post.title ?? 'Unnamed Trail',
                    description: post.description ?? 'No description provided',
                    moderation_status: post.moderation_status,
                    sport: post.sport,
                    time: post.time,
                    distance: post.distance ? parseFloat(post.distance) : 0,
                    elevation: post.elevation ? parseFloat(post.elevation) : 0,
                })));
            } catch (error) {
                console.error('Error fetching trails:', error);
            }
        };
        fetchTrails();
    }, []);

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return `${hours > 0 ? `${hours}h ` : ''}${minutes}min`;
    };

    const formatDistance = (distance: number) => distance.toFixed(2);

    const formatElevation = (elevation: number) => elevation.toFixed(2);

    const getModerationColor = (moderationStatus: string) => {
        switch (moderationStatus) {
            case 'easy':
                return '#7dcc67';
            case 'medium':
                return 'orange';
            case 'hard':
                return 'red';
            case 'extreme':
                return 'black';
            default:
                return '#7dcc67';
        }
    };

    const filteredTrails = trails
        .filter(trail => trail.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title));

    const handleTrailClick = (id: number) => {
        onTrailSelect(id); // Pass the selected trail ID to the parent component
    };

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
                    <Card
                        key={trail.id}
                        className="trail-card"
                        onClick={() => handleTrailClick(trail.id)} // Pass trail ID on click
                        style={{ cursor: 'pointer' }} // Make the card look clickable
                    >
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
                                        <strong><FiClock /></strong> {formatTime(trail.time)}
                                    </div>
                                    <div>
                                        <strong><GiPathDistance /> </strong> {formatDistance(trail.distance)} km
                                    </div>
                                    <div>
                                        <strong><GoArrowUpRight /> </strong> {formatElevation(trail.elevation)} m
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
