import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrailPlanner.scss';
import axios from 'axios';

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

    const defaultCenter: [number, number] = [41.14524580049242, 22.498578357610327]; // Default center

    // Function to parse the GPX file and extract coordinates
    const parseGpxFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target?.result as string;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "application/xml");

            const trkpts = xmlDoc.getElementsByTagName('trkpt');
            const coordinates: [number, number][] = [];

            for (let i = 0; i < trkpts.length; i++) {
                const lat = parseFloat(trkpts[i].getAttribute('lat') || '0');
                const lon = parseFloat(trkpts[i].getAttribute('lon') || '0');
                coordinates.push([lat, lon]);
            }

            setGpxCoordinates(coordinates); 

            if (coordinates.length > 0) {
                const middleIndex = Math.floor(coordinates.length / 2);
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

        try {
            // Send the form data to the backend
            const response = await axios.post('http://localhost:8000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Trail added successfully:', response.data);
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
