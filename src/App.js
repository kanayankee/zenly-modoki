import React, { useState } from 'react';
import Map from './Map';

const App = () => {
  const [roomID, setRoomID] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleCreateRoom = () => {
    // Generate a new room ID
    const newRoomID = generateRoomID();
    setRoomID(newRoomID);
    setShowMap(true);
  };

  const handleJoinRoom = () => {
    // Join an existing room by setting the room ID
    setShowMap(true);
  };

  // Function to generate a random room ID
  const generateRoomID = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1><img src="/maigo_x.svg" style={{ width: '90%', maxWidth: '390px', margin: '20px auto' }}></img></h1>
      {/* <button onClick={handleCreateRoom}></button> */}
      <img src="/room_create.svg" style={{ width: '50%', maxWidth: '185px', margin: '20px auto', display: 'block' }} onClick={handleCreateRoom}></img>
      <img src="/room_in.svg" style={{ width: '50%', maxWidth: '185px', margin: '20px auto', display: 'block' }} onClick={handleJoinRoom}></img>
      <input
        type="text"
        placeholder="ルームIDを入力"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
      />
      {showMap && roomID && <Map roomID={roomID} />}
    </div>
  );
};

export default App;
