import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const BrowseTrails: React.FC = () => {
    return (
        <div className="browse-trails-container">
            <Sidebar />
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
                    <Marker position={[41.14524580049242, 22.498578357610327]}>
        
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

export default BrowseTrails;
