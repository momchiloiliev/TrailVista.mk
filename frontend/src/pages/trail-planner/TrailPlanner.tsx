import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

const TrailPlanner: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState('hiking');
    const [moderation, setModeration] = useState('easy');
    const [gpxFile, setGpxFile] = useState<File | null>(null);

    // Handle file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setGpxFile(event.target.files[0]);
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
            formData.append('file_path', gpxFile); // Ensure that the file is sent with the correct field name
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
                        <option value="medium">Normal</option>
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
                    center={[41.14524580049242, 22.498578357610327]}
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
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
