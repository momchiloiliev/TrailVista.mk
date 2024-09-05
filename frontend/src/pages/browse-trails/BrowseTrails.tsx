import React, { useState } from 'react';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import Sidebar from '../../components/sidebar/Sidebar';
import 'leaflet/dist/leaflet.css';
import './BrowseTrails.scss';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component to handle GPX file parsing and adding to the map
const MapWithGPX: React.FC<{ gpxUrl: string | null }> = ({ gpxUrl }) => {
    const map = useMap(); // Get the map instance
    const [route, setRoute] = useState<L.LatLngTuple[]>([]); // State to store the route coordinates

    useEffect(() => {
        if (gpxUrl && map) {
            console.log("Fetching GPX file from:", gpxUrl);

            fetch(gpxUrl)
                .then(response => response.text())
                .then(gpxData => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(gpxData, "application/xml");

                    const trackPoints = xmlDoc.getElementsByTagName("trkpt");
                    const coordinates: L.LatLngTuple[] = Array.from(trackPoints).map(point => {
                        const lat = parseFloat(point.getAttribute('lat') || '0');
                        const lon = parseFloat(point.getAttribute('lon') || '0');
                        return [lat, lon] as L.LatLngTuple;
                    });

                    const validCoordinates = coordinates.filter(coord => coord[0] !== 0 && coord[1] !== 0);

                    if (validCoordinates.length > 0) {
                        setRoute(validCoordinates);
                        map.fitBounds(validCoordinates);
                    } else {
                        console.error("No valid track points found in GPX file.");
                    }
                })
                .catch(error => console.error("Error loading GPX file:", error));
        }
    }, [gpxUrl, map]);

    return route.length > 0 ? <Polyline positions={route} color="blue" /> : null;
};

const BrowseTrails: React.FC = () => {
    const [gpxUrl, setGpxUrl] = useState<string | null>(null); // State to store selected GPX URL

    return (
        <div className="browse-trails-container">
            <Sidebar onTrailSelect={setGpxUrl} /> {/* Pass setGpxUrl to Sidebar */}

            <div className="map-container-bt">
                <MapContainer
                    center={[41.14524580049242, 22.498578357610327]}
                    zoom={16}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {gpxUrl && <MapWithGPX gpxUrl={gpxUrl} />}
                </MapContainer>
            </div>
        </div>
    );
};

export default BrowseTrails;
