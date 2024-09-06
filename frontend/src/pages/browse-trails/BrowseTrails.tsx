import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import Sidebar from '../../components/sidebar/Sidebar';
import 'leaflet/dist/leaflet.css';
import './BrowseTrails.scss';
import axios from 'axios';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

interface Trail {
    id: number;
    title: string;
    description: string;
    file_path: string;
    coords: LatLngTuple[]; // Fixed: coordinates should use LatLngTuple[]
}

// Preset list of bold colors to ensure high visibility
const boldColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080', '#00FFFF', '#FFC0CB', '#FFFF00', '#8B4513', '#FFD700',
    '#008000', '#FF6347', '#4682B4', '#DC143C', '#FF4500', '#9ACD32', '#FF1493', '#7B68EE', '#7FFF00', '#00FA9A'
];

// Define the missing `getRandomColor` function to generate random colors
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const BrowseTrails: React.FC = () => {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [trailPaths, setTrailPaths] = useState<any[]>([]);
    const [selectedTrailCoords, setSelectedTrailCoords] = useState<LatLngTuple[]>([]); // Fixed the type to match an array of LatLngTuple

    // Fetch trails from the backend
    useEffect(() => {
        const fetchTrails = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/posts');
                const trailsData = response.data.data;
                setTrails(trailsData);
                fetchGPXFiles(trailsData);
            } catch (error) {
                console.error('Error fetching trails:', error);
            }
        };

        const fetchGPXFiles = async (trailsData: Trail[]) => {
            const paths = await Promise.all(
                trailsData.map(async (trail, index) => {
                    try {
                        const res = await axios.get(`http://localhost:8000/storage/${trail.file_path}`, { responseType: 'text' });
                        const gpxData = new window.DOMParser().parseFromString(res.data, 'application/xml');
                        const coords = parseGPX(gpxData);

                        // Assign a distinct color from the list or generate a random one
                        const color = index < boldColors.length ? boldColors[index] : getRandomColor();

                        return { 
                            id: trail.id, 
                            coords, 
                            title: trail.title, 
                            description: trail.description, 
                            color 
                        };
                    } catch (error) {
                        console.error('Error fetching GPX file:', error);
                        return null;
                    }
                })
            );
            setTrailPaths(paths.filter((path) => path !== null));
        };

        fetchTrails();
    }, []);

    // Parse GPX file and extract coordinates
    const parseGPX = (gpxData: Document) => {
        const trkpts = gpxData.getElementsByTagName('trkpt');
        const coordinates: LatLngTuple[] = [];
        for (let i = 0; i < trkpts.length; i++) {
            const lat = parseFloat(trkpts[i].getAttribute('lat') || '0');
            const lon = parseFloat(trkpts[i].getAttribute('lon') || '0');
            coordinates.push([lat, lon]); // Fixed the push to properly return a tuple of [number, number]
        }
        return coordinates;
    };

    // Handle trail selection and fetch specific trail's coordinates
    const handleTrailSelect = async (trailId: number) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/posts/${trailId}`);
            const trail = response.data.data;
            const gpxResponse = await axios.get(`http://localhost:8000/storage/${trail.file_path}`, { responseType: 'text' });
            const gpxData = new window.DOMParser().parseFromString(gpxResponse.data, 'application/xml');
            const coords = parseGPX(gpxData);
            setSelectedTrailCoords(coords); // Set the selected trail coordinates to re-center the map
        } catch (error) {
            console.error("Error fetching the selected trail data:", error);
        }
    };

    // Component to handle recentering the map to the selected trail
    const RecenterMap = () => {
        const map = useMap();
        useEffect(() => {
            if (selectedTrailCoords && selectedTrailCoords.length > 0) {
                map.fitBounds(L.latLngBounds(selectedTrailCoords)); // Fit the selected trail within the map's view
            }
        }, [selectedTrailCoords, map]);

        return null;
    };

    return (
        <div className="browse-trails-container">
            <Sidebar onTrailSelect={handleTrailSelect} />
            <div className="map-container-bt">
                <MapContainer
                    center={[41.14524580049242, 22.498578357610327]}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Component to recenter the map */}
                    <RecenterMap />

                    {/* Render each trail path with bold, distinct colors */}
                    {trailPaths.map((trail) => (
                        <React.Fragment key={trail.id}>
                            <Polyline
                                positions={trail.coords}
                                color={trail.color}
                                weight={5}  // Increase line thickness for better visibility
                                opacity={0.9}  // High opacity for strong color contrast
                            />
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default BrowseTrails;
