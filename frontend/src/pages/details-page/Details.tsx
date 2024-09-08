import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Card, CardContent, Grid, Divider, Button } from '@mui/material';
import { FiClock, FiDownload, FiShare } from "react-icons/fi";
import { GiPathDistance } from "react-icons/gi";
import { GoArrowUpRight } from "react-icons/go";
import { MdDirectionsBike } from "react-icons/md";
import { FaRunning, FaHiking } from "react-icons/fa";
import { BsPrinter, BsSave } from "react-icons/bs";
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Details.scss'; // For custom styling
import CommentSection from '../../components/comment-section/CommentSection';

interface TrailDetails {
    id: number;
    title: string;
    description: string;
    moderation_status: string;
    sport: string;
    time: string | null;
    distance: number | null;
    elevation: number | null;
    file_path: string;
    coords: LatLngTuple[]; // Coordinates for map
}

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

const Details: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [trail, setTrail] = useState<TrailDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [coords, setCoords] = useState<LatLngTuple[]>([]); // Map coordinates

    useEffect(() => {
        const fetchTrail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/posts/${id}`);
                const post = response.data.data;

                // Fetch GPX file
                const gpxResponse = await axios.get(`http://localhost:8000/storage/${post.file_path}`, { responseType: 'text' });
                const gpxData = new window.DOMParser().parseFromString(gpxResponse.data, 'application/xml');
                const parsedCoords = parseGPX(gpxData); // Parse GPX data to get coordinates

                setCoords(parsedCoords);

                setTrail({
                    id: post.id,
                    title: post.title ?? 'Unnamed Trail',
                    description: post.description ?? 'No description provided',
                    moderation_status: post.moderation_status,
                    sport: post.sport,
                    time: post.time,
                    distance: post.distance ? parseFloat(post.distance) : null,
                    elevation: post.elevation ? parseFloat(post.elevation) : null,
                    file_path: post.file_path,
                    coords: parsedCoords,
                });
                setLoading(false);
            } catch (error) {
                setError('Error fetching trail details');
                setLoading(false);
            }
        };

        fetchTrail();
    }, [id]);

    const parseGPX = (gpxData: Document) => {
        const trkpts = gpxData.getElementsByTagName('trkpt');
        const coordinates: LatLngTuple[] = [];
        for (let i = 0; i < trkpts.length; i++) {
            const lat = parseFloat(trkpts[i].getAttribute('lat') || '0');
            const lon = parseFloat(trkpts[i].getAttribute('lon') || '0');
            coordinates.push([lat, lon]);
        }
        return coordinates;
    };

    const RecenterMap = () => {
        const map = useMap();
        useEffect(() => {
            if (coords && coords.length > 0) {
                map.fitBounds(L.latLngBounds(coords)); // Center map on the coordinates
            }
        }, [coords, map]);
        return null;
    };

    const formatTime = (time: string | null) => {
        if (!time) return 'No time available';
        const [hours, minutes] = time.split(':').map(Number);
        return `${hours > 0 ? `${hours}h ` : ''}${minutes}min`;
    };

    const formatDistance = (distance: number | null) => {
        if (distance === null) return 'No distance available';
        return distance.toFixed(2);
    };

    const formatElevation = (elevation: number | null) => {
        if (elevation === null) return 'No elevation data';
        return elevation.toFixed(2);
    };

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

    const renderSportIcon = (sport: string) => {
        switch (sport) {
            case 'biking':
                return <MdDirectionsBike size={24} />;
            case 'running':
                return <FaRunning size={24} />;
            case 'hiking':
                return <FaHiking size={24} />;
            default:
                return null;
        }
    };

    const handleSave = () => {
        alert("Trail saved!");
    };

    const handleDownloadGPX = () => {
        if (trail?.file_path && trail?.title) {
            const filename = trail.file_path.split('/').pop(); // Extract the filename from the file path
            const title = encodeURIComponent(trail.title);  // Encode title to handle special characters
    
            window.open(`http://localhost:8000/api/download-gpx/${filename}/${title}`, '_blank');
        } else {
            alert("GPX file or trail title not found.");
        }
    };
    
    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="h6" color="error" align="center">
                {error}
            </Typography>
        );
    }

    if (!trail) {
        return (
            <Typography variant="h6" align="center">
                Trail not found.
            </Typography>
        );
    }

    return (
        <Box p={4} className="details-container">
            <Grid container spacing={3}>
                {/* First Grid: Trail Information (60%) */}
                <Grid item xs={12} md={7}>
                    <Card className="details-card-info">
                        <CardContent>
                            <div className="status-activity-container">
                                <div className="trail-mod-status" style={{ backgroundColor: getModerationColor(trail.moderation_status) }}>
                                    {trail.moderation_status}
                                </div>
                                <div className="trail-activity">
                                    {renderSportIcon(trail.sport)}
                                </div>
                            </div>
                            <Typography variant="h4" gutterBottom>
                                {trail.title}
                            </Typography>
                            <Divider />
                            <Typography variant="body1" gutterBottom>
                                {trail.description}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Grid container spacing={2}>
                        <Grid item xs={6} style={{ textAlign: 'left' }}>
                            {/* Add CommentSection here */}
                    <div className="comment-section">
                        <CommentSection trailId={trail.id} />
                    </div>
                        </Grid>
                    </Grid>
                    {/* Add CommentSection here
                    <div className="comment-section">
                        <CommentSection trailId={trail.id} />
                    </div> */}
                </Grid>

                {/* Second Grid: Trail Metrics and Map (40%) */}
                <Grid item xs={12} md={5}>
                    <Card className="details-card-metrics">
                        <CardContent>
                            <Box mb={2}>
                                <MapContainer
                                    center={coords.length > 0 ? coords[0] : [41.731362341090836, 21.79114740261746]}
                                    zoom={9}
                                    style={{ height: '400px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <RecenterMap />
                                    <Polyline positions={coords} color="blue" />
                                </MapContainer>
                            </Box>
                            <Grid container spacing={2}>
                                {/* Metrics Column */}
                                <Grid item xs={6} style={{ textAlign: 'left' }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <FiClock style={{ marginRight: 8 }} /> Time: {formatTime(trail.time)}
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <GiPathDistance style={{ marginRight: 8 }} /> Distance: {formatDistance(trail.distance)} km
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <GoArrowUpRight style={{ marginRight: 8 }} /> Elevation Gain: {formatElevation(trail.elevation)} m
                                    </Typography>
                                </Grid>

                                {/* Action Buttons Column */}
                                <Grid item xs={6} style={{ textAlign: 'right' }}>
                                    <Button onClick={handleSave} startIcon={<BsSave />} fullWidth sx={{ mb: 2 }}>
                                        Save
                                    </Button>
                                    <Button onClick={handleDownloadGPX} startIcon={<FiDownload />} fullWidth sx={{ mb: 2 }}>
                                        Download GPX file
                                    </Button>
                                    <Button onClick={handlePrint} startIcon={<BsPrinter />} fullWidth sx={{ mb: 2 }}>
                                        Print
                                    </Button>
                                    <Button onClick={handleShare} startIcon={<FiShare />} fullWidth>
                                        Share
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Details;
