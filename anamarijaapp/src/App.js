// src/App.js
import React, { useState } from 'react';
import StartScreen from './StartScreen';
import AudioPlayer from './AudioPlayer';
import lyrics from './lyrics';
import audioFile from './AnamarijaP.wav';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="app-container">
      <div className="aurora-extra"></div>
      {!started ? (
        <StartScreen onStart={() => setStarted(true)} />
      ) : (
        <AudioPlayer
          audioSrc={audioFile}
          lyrics={lyrics}
          onEnded={() => {/* ... */}}
        />
      )}
    </div>
  );
}

export default App;
