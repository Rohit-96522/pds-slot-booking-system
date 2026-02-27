import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon for bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
    onLocationSelect: (address: string, lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

export default function LocationPicker({ onLocationSelect, initialLat, initialLng }: LocationPickerProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const callbackRef = useRef(onLocationSelect);
    const [geoLoading, setGeoLoading] = useState(true);

    // Always keep the ref pointing to the latest callback
    useEffect(() => {
        callbackRef.current = onLocationSelect;
    }, [onLocationSelect]);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Initialize map centered on India by default
        const map = L.map(containerRef.current).setView(
            [initialLat ?? 20.5937, initialLng ?? 78.9629],
            5
        );
        mapRef.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // Try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    map.setView([latitude, longitude], 15);
                    setGeoLoading(false);
                },
                () => setGeoLoading(false),
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            setGeoLoading(false);
        }

        // Handle map clicks
        map.on('click', async (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;

            // Place or move marker
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng]).addTo(map);
            }

            // Reverse geocode using free Nominatim API
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await res.json();
                const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                callbackRef.current(address, lat, lng);
            } catch {
                callbackRef.current(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng);
            }
        });

        // Cleanup on unmount
        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="space-y-2">
            <div
                className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                style={{ height: '280px', width: '100%' }}
            >
                {geoLoading && (
                    <div className="absolute inset-0 z-[1000] bg-white/80 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Detecting your location...
                        </div>
                    </div>
                )}
                <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
            </div>
            <p className="text-xs text-gray-500">
                📍 Click on the map to pin your location. The address will be auto-filled.
            </p>
        </div>
    );
}
