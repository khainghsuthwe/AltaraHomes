'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface MapProps {
  latitude: number;
  longitude: number;
}

export default function Map({ latitude, longitude }: MapProps) {
  const position: LatLngExpression = [latitude, longitude];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} className="rounded">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>Property Location</Popup>
      </Marker>
    </MapContainer>
  );
}