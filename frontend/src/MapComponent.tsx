import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issues with React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Define the center of the map as a tuple
// const center: [number, number] = [51.505, -0.09];

const MapComponent: React.FC = () => {
  useEffect(() => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.style.height = '100vh';
    }
  }, []);

  return (
    <div>
      <MapContainer id="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[41.9996479336892, 21.438695249988935]}>
          <Popup>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
