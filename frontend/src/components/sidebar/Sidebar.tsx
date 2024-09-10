import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, IconButton, TextField, Card, CardContent, Collapse } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt'; // Import the filter icon
import axios from 'axios';
import './Sidebar.scss';
import { FiClock } from "react-icons/fi";
import { GiPathDistance } from "react-icons/gi";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import FilterTrails from '../filter-trails/FilterTrails'; // Import the filter component

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
    onTrailSelect: (trailId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTrailSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [trails, setTrails] = useState<Trail[]>([]);
    const [filteredTrails, setFilteredTrails] = useState<Trail[]>([]); // Store filtered trails
    const [showFilter, setShowFilter] = useState(false); // State to show/hide the filter form
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrails = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/posts');
                const trailData = response.data.data.map((post: any) => ({
                    id: post.id,
                    title: post.title ?? 'Unnamed Trail',
                    description: post.description ?? 'No description provided',
                    moderation_status: post.moderation_status,
                    sport: post.sport,
                    time: post.time,
                    distance: post.distance ? parseFloat(post.distance) : 0,
                    elevation: post.elevation ? parseFloat(post.elevation) : 0,
                }));
                setTrails(trailData);
                setFilteredTrails(trailData); // Initially, all trails are shown
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

    const applyFilters = (filters: any) => {
        const { sports, difficulties, times, distances, elevations } = filters;
    
        // Helper function to convert time string to total minutes
        const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };
    
        const filtered = trails.filter(trail => {
            const matchesSport = sports.length === 0 || sports.includes(trail.sport);
            const matchesDifficulty = difficulties.length === 0 || difficulties.includes(trail.moderation_status);
    
            // Convert trail time to minutes
            const trailTimeInMinutes = timeToMinutes(trail.time);
            const matchesTime = times.length === 0 || times.some((time: string) => {
                if (time === "<1") return trailTimeInMinutes < 60;
                if (time === "1-3") return trailTimeInMinutes >= 60 && trailTimeInMinutes <= 180;
                if (time === ">3") return trailTimeInMinutes > 180;
                return false;
            });
    
            const matchesDistance = distances.length === 0 || distances.some((dist: string) => {
                if (dist === "<5") return trail.distance < 5;
                if (dist === "5-10") return trail.distance >= 5 && trail.distance <= 10;
                if (dist === "10-30") return trail.distance >= 10 && trail.distance <= 30;
                if (dist === "30-50") return trail.distance >= 30 && trail.distance <= 50;
                if (dist === ">50") return trail.distance > 50;
                return false;
            });
    
            const matchesElevation = elevations.length === 0 || elevations.some((elev: string) => {
                if (elev === "500") return trail.elevation < 500;
                if (elev === "500-1000") return trail.elevation >= 500 && trail.elevation <= 1000;
                if (elev === "1000-2000") return trail.elevation >= 1000 && trail.elevation <= 2000;
                if (elev === "2000-3000") return trail.elevation >= 2000 && trail.elevation <= 3000;
                if (elev === ">3000") return trail.elevation > 3000;
                return false;
            });
    
            return matchesSport && matchesDifficulty && matchesTime && matchesDistance && matchesElevation;
        });
    
        setFilteredTrails(filtered); // Update the filtered trail list
        setShowFilter(false); // Close the filter after applying
    };
    

    const filteredTrailsBySearch = filteredTrails
        .filter(trail => trail.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title));

    const handleTrailClick = (id: number) => {
        onTrailSelect(id); 
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
                            <Box>
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                                <IconButton onClick={() => setShowFilter(!showFilter)}> {/* Toggle filter visibility */}
                                    <FilterAltIcon />
                                </IconButton>
                            </Box>
                        ),
                    }}
                />
            </Box>

            {/* Filter Form - Collapsible */}
            <Collapse in={showFilter} className='filter-trails-sidebar'>
                <FilterTrails onApplyFilters={applyFilters} />
            </Collapse>

            <List className="trail-list">
                {filteredTrailsBySearch.map((trail) => (
                    <Card
                        key={trail.id}
                        className="trail-card"
                        onClick={() => handleTrailClick(trail.id)}
                        style={{ cursor: 'pointer' }}
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
                                        <strong><FiClock /></strong>
                                    </div>
                                    <div className='icons'>
                                        {formatTime(trail.time)}
                                    </div>
                                    <div>
                                        <strong><GiPathDistance /> </strong>
                                    </div>
                                    <div className='icons'>
                                        {formatDistance(trail.distance)} km
                                    </div>
                                    <div>
                                        <strong><GoArrowUpRight /> </strong>
                                    </div>
                                    <div className='icons'>
                                        {formatElevation(trail.elevation)} m
                                    </div>
                                </div>
                                <div className='details'>
                                    <button
                                        className="view-post-button"
                                        onClick={() => navigate(`/posts/${trail.id}`)}
                                    >
                                        More Details
                                    </button>
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
