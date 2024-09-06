import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrailPlanner.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure Leaflet marker icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component to recenter the map to the marker position
const RecenterMap = ({ markerPosition }: { markerPosition: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (markerPosition) {
            map.setView(markerPosition, map.getZoom(), { animate: true });
        }
    }, [markerPosition, map]);

    return null;
};

const TrailPlanner: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState('hiking');
    const [moderation, setModeration] = useState('easy');
    const [gpxFile, setGpxFile] = useState<File | null>(null);
    const [gpxCoordinates, setGpxCoordinates] = useState<[number, number][]>([]); // Store coordinates
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null); // Store marker position

    const [elevation, setElevation] = useState(0); // Calculated elevation gain
    const [distance, setDistance] = useState(0);   // Calculated distance
    const [time, setTime] = useState('00:00:00');  // Calculated moving time

    const defaultCenter: [number, number] = [41.14524580049242, 22.498578357610327]; // Default center

    const navigate = useNavigate();

    // Haversine formula to calculate distance between two coordinates in meters
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (x: number) => (x * Math.PI) / 180;
        const R = 6371e3; // Radius of Earth in meters
        const φ1 = toRad(lat1);
        const φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lon2 - lon1);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in meters
    };

    // Function to parse the GPX file and extract coordinates, distance, elevation, total time, and moving time
    const parseGpxFile = (file: File) => {
        const reader = new FileReader();
    
        reader.onload = function (e) {
            const text = e.target?.result as string;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "application/xml");
    
            const trkpts = xmlDoc.getElementsByTagName('trkpt');
            const coordinates: [number, number][] = [];
            let totalElevationGain = 0;
            let totalElevationLoss = 0;
            let totalDistance = 0;
            let startTime: Date | null = null;
            let endTime: Date | null = null;
            let movingTimeInSeconds = 0;
    
            let previousLat = 0;
            let previousLon = 0;
            let previousElevation = 0;
            let previousTime: Date | null = null;
    
            const speedThreshold = 0.5; // Speed threshold in km/h to consider movement
            const elevationThreshold = 0; // Threshold in meters to filter out minor elevation changes
    
            for (let i = 0; i < trkpts.length; i++) {
                const lat = parseFloat(trkpts[i].getAttribute('lat') || '0');
                const lon = parseFloat(trkpts[i].getAttribute('lon') || '0');
                const elevation = parseFloat(trkpts[i].getElementsByTagName('ele')[0]?.textContent || '0');
                const timePoint = trkpts[i].getElementsByTagName('time')[0]?.textContent || '';
                const currentTime = new Date(timePoint);
    
                coordinates.push([lat, lon]);
    
                // Calculate distance
                if (i > 0) {
                    const distanceBetweenPoints = haversineDistance(previousLat, previousLon, lat, lon);
                    totalDistance += distanceBetweenPoints;
    
                    const timeDifferenceInSeconds = (currentTime.getTime() - previousTime!.getTime()) / 1000;
                    const speed = (distanceBetweenPoints / 1000) / (timeDifferenceInSeconds / 3600); // speed in km/h
    
                    // Calculate moving time if speed exceeds threshold
                    if (speed > speedThreshold) {
                        movingTimeInSeconds += timeDifferenceInSeconds;
                    }
                }
    
                // Calculate elevation gain/loss with threshold
                if (i > 0) {
                    const elevationDifference = elevation - previousElevation;
                    if (Math.abs(elevationDifference) >= elevationThreshold) { // Ignore small elevation changes
                        if (elevationDifference > 0) {
                            totalElevationGain += elevationDifference; // Positive gain
                        } else {
                            totalElevationLoss += Math.abs(elevationDifference); // Negative loss
                        }
                    }
                }
    
                // Set start time
                if (i === 0) {
                    startTime = new Date(timePoint);
                }
    
                // Update end time
                endTime = currentTime;
    
                // Update previous point
                previousLat = lat;
                previousLon = lon;
                previousElevation = elevation;
                previousTime = currentTime;
            }
    
            // Calculate total moving time
            const movingHours = Math.floor(movingTimeInSeconds / 3600);
            const movingMinutes = Math.floor((movingTimeInSeconds % 3600) / 60);
            const movingSeconds = Math.floor(movingTimeInSeconds % 60);
    
            setTime(`${movingHours.toString().padStart(2, '0')}:${movingMinutes.toString().padStart(2, '0')}:${movingSeconds.toString().padStart(2, '0')}`);
    
            setElevation(totalElevationGain); // Elevation gain is the total uphill portion
            setDistance(totalDistance / 1000); // Convert to kilometers
            setGpxCoordinates(coordinates);
    
            if (coordinates.length > 0) {
                setMarkerPosition(coordinates[0]); // Set marker on the start of the route
            }
        };
    
        reader.readAsText(file);
    };
    

    // Handle file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setGpxFile(file);
            parseGpxFile(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('sport', activity);
        formData.append('moderation_status', moderation);

        if (gpxFile) {
            formData.append('file_path', gpxFile);
        }

        // Append calculated distance, elevation, and moving time
        formData.append('distance', distance.toString());
        formData.append('elevation', elevation.toString());
        formData.append('time', time);

        try {
            // Send the form data to the backend
            const response = await axios.post('http://localhost:8000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Trail added successfully:', response.data);
            navigate('/browse-trails');
        } catch (error: any) {
            console.error('Error adding trail:', error.response?.data || error.message);
        }
    };

    return (
        <div className="browse-trails-container-tp">
            <div className="form-container">
                <form className="trail-form" onSubmit={handleSubmit}>
                    <h2>Add a New Trail</h2>

                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>

                    <label htmlFor="activity">Activity Type:</label>
                    <select
                        id="activity"
                        name="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        required
                    >
                        <option value="hiking">Hiking</option>
                        <option value="biking">Biking</option>
                        <option value="running">Running</option>
                    </select>

                    <label htmlFor="moderation">Moderation Level:</label>
                    <select
                        id="moderation"
                        name="moderation"
                        value={moderation}
                        onChange={(e) => setModeration(e.target.value)}
                        required
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="extreme">Extreme</option>
                    </select>

                    <label htmlFor="gpxfile">Attach a GPX File:</label>
                    <input
                        type="file"
                        id="gpxfile"
                        name="gpxfile"
                        accept=".gpx,.xml"
                        onChange={handleFileChange}
                        required
                    />

                    <button type="submit">Add Trail</button>
                </form>
            </div>

            <div className="map-container">
                <MapContainer
                    center={markerPosition || defaultCenter} // Center the map on marker position if available
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Recenter the map when markerPosition changes */}
                    <RecenterMap markerPosition={markerPosition} />

                    {/* Render GPX coordinates as a polyline */}
                    {gpxCoordinates.length > 0 && (
                        <Polyline positions={gpxCoordinates} color="blue" />
                    )}

                    {/* Set the marker on the GPX route */}
                    {markerPosition && (
                        <Marker position={markerPosition} />
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default TrailPlanner;
