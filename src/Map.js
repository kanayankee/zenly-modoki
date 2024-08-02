import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

mapboxgl.accessToken =
  'pk.eyJ1IjoicG9vaHNhbiIsImEiOiJjbHd1anpsMXQwZmQ5MmlvbHRncWpvNm0yIn0.rFy6hrRBt8-yYCUdWpscRg';

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(20);
  const [marker, setMarker] = useState(null);
  const [gpsAllowed, setGpsAllowed] = useState(true);

  useEffect(() => {
    const initializeMap = (longitude, latitude) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: zoom
      });

      mapRef.current = map;

      const language = new MapboxLanguage({
        defaultLanguage: 'ja'
      });
      map.addControl(language);
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.on('move', () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });

      const newMarker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);
      setMarker(newMarker);
    };

    const handleLocationError = (error) => {
      console.error("Error getting location: ", error);
      setGpsAllowed(false);
      alert("GPSの使用が許可されていません。位置情報の共有を許可してください。");
      // デフォルトの位置を設定
      initializeMap(135.78619462372777, 35.06516515940067);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { longitude, latitude } = position.coords;
          setLng(longitude);
          setLat(latitude);
          initializeMap(longitude, latitude);
        },
        handleLocationError,
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setGpsAllowed(false);
      alert("お使いのブラウザはGPSをサポートしていません。");
      // デフォルトの位置を設定
      initializeMap(135.78619462372777, 35.06516515940067);
    }

    return () => mapRef.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mapRef.current || !marker || !gpsAllowed) return;

    const watchId = navigator.geolocation.watchPosition(
      position => {
        const { longitude, latitude } = position.coords;
        setLng(longitude);
        setLat(latitude);
        mapRef.current.flyTo({ center: [longitude, latitude], zoom: zoom });
        marker.setLngLat([longitude, latitude]);
      },
      error => {
        console.error("Error watching position: ", error);
        setGpsAllowed(false);
        alert("位置情報の取得中にエラーが発生しました。");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [marker, zoom, gpsAllowed]);

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          経度: {lng} | 緯度: {lat} | ズーム: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
      {!gpsAllowed && (
        <div className="gps-warning">
          GPSが無効です。位置情報の共有を許可してください。
        </div>
      )}
    </div>
  );
};

export default Map;