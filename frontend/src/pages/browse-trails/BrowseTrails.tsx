import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import Sidebar from '../../components/sidebar/Sidebar';
import 'leaflet/dist/leaflet.css';
import './BrowseTrails.scss';
import axios from 'axios';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface Trail {
    id: number;
    title: string;
    description: string;
    file_path: string;
}

const BrowseTrails: React.FC = () => {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [trailPaths, setTrailPaths] = useState<any[]>([]);

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
                trailsData.map(async (trail) => {
                    try {
                        const res = await axios.get(`http://localhost:8000/storage/${trail.file_path}`, { responseType: 'text' });
                        const gpxData = new window.DOMParser().parseFromString(res.data, 'application/xml');
                        const coords = parseGPX(gpxData);
                        return { id: trail.id, coords, title: trail.title, description: trail.description };
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
        const coordinates: L.LatLngTuple[] = [];
        for (let i = 0; i < trkpts.length; i++) {
            const lat = parseFloat(trkpts[i].getAttribute('lat') || '0');
            const lon = parseFloat(trkpts[i].getAttribute('lon') || '0');
            coordinates.push([lat, lon]);
        }
        return coordinates;
    };

    return (
        <div className="browse-trails-container">
            <Sidebar />
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

                    {/* Render each trail path */}
                    {trailPaths.map((trail) => (
                        <React.Fragment key={trail.id}>
                            <Polyline positions={trail.coords} color="blue" weight={3} />
                            <Marker position={trail.coords[0]}>
                                <Popup>
                                    <strong>{trail.title}</strong>
                                    <p>{trail.description}</p>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default BrowseTrails;
