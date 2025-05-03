import React, { useState, useEffect } from 'react';
import classes from './map.module.css';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { toast } from 'react-toastify';
import * as L from 'leaflet';

export default function Map({ readonly, location, onChange, mapRef }) {
  return (
    <div className={classes.container}>
      <MapContainer
        ref={mapRef}
        className={classes.map}
        center={[0, 0]}
        zoom={1}
        dragging={!readonly}
        touchZoom={!readonly}
        doubleClickZoom={!readonly}
        scrollWheelZoom={!readonly}
        boxZoom={!readonly}
        keyboard={!readonly}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FindButtonAndMarker
          readonly={readonly}
          location={location}
          onChange={onChange}
        />
      </MapContainer>
    </div>
  );
}

function FindButtonAndMarker({ readonly, location, onChange }) {
  const [position, setPosition] = useState(location);

  const map = useMapEvents({
    async click(e) {
      if (!readonly) { 
        setPosition(e.latlng);
        const address = await reverseGeocode(e.latlng);
        onChange(e.latlng, address);
      }
    },
    async locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 13);

      const address = await reverseGeocode(e.latlng);
      onChange(e.latlng, address);
    },
    locationerror(e) {
      toast.error(e.message);
    },
  });

  useEffect(() => {
    if (location) {
      setPosition(location);
      map.flyTo(location, 13);
    }
  }, [location, map]);

  const markerIcon = new L.Icon({
    iconUrl: '/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

  return (
    <>
      {!readonly && (
        <button
          type="button"
          className={classes.find_location}
          onClick={() => map.locate()}
        >
          Find My Location
        </button>
      )}

      {position && (
        <Marker
          eventHandlers={{
            dragend: async (e) => {
              const newPos = e.target.getLatLng();
              setPosition(newPos);
              const address = await reverseGeocode(newPos);
              onChange(newPos, address)
            },
          }}
          position={position}
          draggable={!readonly}
          icon={markerIcon}
        >
          <Popup>Shipping Location</Popup>
        </Marker>
      )}
    </>
  );
}

// Hàm đổi tên địa chỉ thành latlng
export async function forwardGeocode(address) {
  try{
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    return data[0] ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon)} : { lat: '', lng: '' };
  } catch (error) {
    console.error("Forward geocoding error:", error);
    return { lat: '', lng: '' };
  }
}

// Hàm đổi latlng thành địa chỉ
async function reverseGeocode(latlng) {
  try {
    const { lat, lng } = latlng;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    
    return data.display_name || "Không thể xác định địa chỉ";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Không thể lấy địa chỉ";
  }
}