import React, { useState } from 'react';

const RoomJoinForm = ({ onJoin }) => {
    const [inputRoomID, setInputRoomID] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onJoin(inputRoomID);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                ルームIDを入力:
                <input
                    type="text"
                    value={inputRoomID}
                    onChange={(e) => setInputRoomID(e.target.value)}
                />
            </label>
            <button type="submit">ルームに参加</button>
        </form>
    );
};

export default RoomJoinForm;
