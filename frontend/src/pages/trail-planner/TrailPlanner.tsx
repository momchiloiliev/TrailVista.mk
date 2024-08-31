import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrailPlanner.scss';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const TrailPlanner: React.FC = () => {
    return (
        <div className="browse-trails-container-tp">
            <div className="form-container">
                <form className="trail-form">
                    <h2>Add a New Trail</h2>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" required />

                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" rows={4} required></textarea>

                    <label htmlFor="activity">Activity Type:</label>
                    <select id="activity" name="activity" required>
                        <option value="mountain biking">Mountain Biking</option>
                        <option value="hiking">Hiking</option>
                        <option value="cycling">Cycling</option>
                    </select>

                    <label htmlFor="moderation">Moderation Level:</label>
                    <select id="moderation" name="moderation" required>
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                        <option value="extreme">Extreme</option>
                    </select>

                    <label htmlFor="gpxfile">Attach a GPX File:</label>
                    <input type="file" id="gpxfile" name="gpxfile" accept=".gpx" required />

                    <button type="submit">Add Trail</button>
                </form>
            </div>

            <div className="map-container">
                <MapContainer
                    center={[41.14524580049242, 22.498578357610327]}
                    zoom={16}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[41.14524580049242, 22.498578357610327]} />
                </MapContainer>
            </div>
        </div>
    );
}

export default TrailPlanner;
