import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

mapboxgl.accessToken = 'pk.eyJ1IjoicG9vaHNhbiIsImEiOiJjbHd1anpsMXQwZmQ5MmlvbHRncWpvNm0yIn0.rFy6hrRBt8-yYCUdWpscRg';

const Map = ({ roomID }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [markers, setMarkers] = useState({});
  const [userPosition, setUserPosition] = useState(null);
  const [currentPositionMarker, setCurrentPositionMarker] = useState(null);
  const [userID] = useState(Math.random().toString(36).substr(2, 9));
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [longitude, latitude];
        setUserPosition(newPosition);
        updateUserPositionInFirestore(newPosition);
      },
      (error) => {
        console.error('Error getting current position:', error);
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [roomID, userID]);

  const updateUserPositionInFirestore = async (position) => {
    const roomRef = doc(db, 'rooms', roomID);
    try {
      await setDoc(roomRef, { users: [] }, { merge: true });
      await updateDoc(roomRef, {
        users: arrayUnion({ id: userID, longitude: position[0], latitude: position[1] })
      });
    } catch (error) {
      console.error('Error updating user position in Firestore:', error);
    }
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userPosition || [0, 0],
        zoom: 10,
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userPosition]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && userPosition) {
      map.setCenter(userPosition);
      map.setZoom(12);

      if (currentPositionMarker) {
        currentPositionMarker.remove();
      }
      const newMarker = new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat(userPosition)
        .addTo(map);
      setCurrentPositionMarker(newMarker);
    }
  }, [userPosition]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && roomID) {
      const unsubscribe = onSnapshot(doc(db, 'rooms', roomID), (docSnapshot) => {
        const data = docSnapshot.data();
        if (data && data.users) {
          Object.values(markers).forEach(marker => marker.remove());
          const newMarkers = {};
          data.users.forEach(user => {
            if (user.id !== userID) {
              const { id, longitude, latitude } = user;
              if (longitude && latitude) {
                const marker = new mapboxgl.Marker({ color: '#0000FF' })
                  .setLngLat([longitude, latitude])
                  .addTo(map);
                newMarkers[id] = marker;
              }
            }
          });
          setMarkers(newMarkers);
        }
      });

      return () => {
        unsubscribe();
        if (userPosition) {
          const roomRef = doc(db, 'rooms', roomID);
          updateDoc(roomRef, {
            users: arrayRemove({ id: userID, longitude: userPosition[0], latitude: userPosition[1] })
          }).catch(error => console.error('Error removing user from room:', error));
        }
      };
    }
  }, [roomID, userID, userPosition]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      {userPosition && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'white',
          padding: '5px',
          borderRadius: '3px',
          boxShadow: '0px 0px 5px rgba(0,0,0,0.3)'
        }}>
          <div>Latitude: {userPosition[1]}</div>
          <div>Longitude: {userPosition[0]}</div>
        </div>
      )}
      {showModal && (
        <div style={{
          position: 'absolute',
          bottom: '50px',
          left: '10%',
          right: '10%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          padding: '10px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button style={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', padding: '10px', color: 'black' }} onClick={() => console.log('動かないで')}>動かないで</button>
          <button style={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', padding: '10px', color: 'black' }} onClick={() => console.log('迎えに来て')}>迎えに来て</button>
          <button style={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', padding: '10px', color: 'black' }} onClick={() => console.log('電話して')}>電話して</button>
          <button style={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', padding: '10px', color: 'black' }} onClick={() => console.log('何階？')}>何階？</button>
        </div>
      )}
    </div>
  );
};

export default Map;
