import React, { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps
} from 'recharts';
import './ElevationMap.scss';

interface ElevationMapProps {
    gpxData: string; // The GPX file data as a string
}

interface ElevationData {
    distance: number; // Distance along the track
    elevation: number; // Elevation at this point
}

interface CustomTooltipProps extends TooltipProps<any, any> {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const ElevationMap: React.FC<ElevationMapProps> = ({ gpxData }) => {
    const [elevationData, setElevationData] = useState<ElevationData[]>([]);

    useEffect(() => {
        const parseGPX = () => {
            const parser = new DOMParser();
            const gpx = parser.parseFromString(gpxData, 'application/xml');
            const trkpts = gpx.getElementsByTagName('trkpt');
            let totalDistance = 0;
            const data: ElevationData[] = [];

            for (let i = 0; i < trkpts.length; i++) {
                const lat = parseFloat(trkpts[i].getAttribute('lat') ?? '0');
                const lon = parseFloat(trkpts[i].getAttribute('lon') ?? '0');
                const ele = parseFloat(trkpts[i].getElementsByTagName('ele')[0]?.textContent ?? '0');

                if (i > 0) {
                    const prevLat = parseFloat(trkpts[i - 1].getAttribute('lat') ?? '0');
                    const prevLon = parseFloat(trkpts[i - 1].getAttribute('lon') ?? '0');
                    const dist = calculateDistance(lat, lon, prevLat, prevLon);
                    totalDistance += dist;
                }

                data.push({
                    distance: totalDistance,
                    elevation: ele,
                });
            }

            setElevationData(data);
        };

        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371; // Radius of the Earth in km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
        };

        parseGPX();
    }, [gpxData]);

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length && label) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                    <p className="label">{`Distance: ${parseFloat(label).toFixed(2)} km`}</p>
                    <p className="intro">{`Elevation: ${payload[0].value.toFixed(2)} m`}</p>
                </div>
            );
        }

        return null;
    };

    // Calculate fixed ticks based on the maximum distance
    const maxDistance = elevationData.reduce((max, data) => data.distance > max ? data.distance : max, 0);
    const ticks = [];
    for (let km = 0; km <= maxDistance; km += 10) {
        ticks.push(km);
    }

    return (
        <div className="elevation-map">
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={elevationData}>
                    <defs>
                        <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="distance" 
                        label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -10 }}
                        ticks={ticks}
                        tickFormatter={(value) => `${value.toFixed(2)}`}
                        domain={['dataMin', 'dataMax']}
                    />
                    <YAxis 
                        dataKey="elevation" 
                        label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                        type="monotone" 
                        dataKey="elevation" 
                        stroke="#82ca9d" 
                        fillOpacity={1} 
                        fill="url(#colorElevation)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ElevationMap;
