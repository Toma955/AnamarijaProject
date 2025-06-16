// src/StartScreen.js
import React, { useState, useRef, useEffect } from 'react';
import './StartScreen.css';
import backgroundImage from './AnaMarija.JPG';
import audioFile from './AnamarijaP.wav';
import lyrics from './lyrics';

const StartScreen = ({ onStart }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyric, setCurrentLyric] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(audioFile));

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartClick = () => {
    setIsFlipped(true);
  };

  const handlePlayClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progress = (currentTime / duration) * 100;
      
      setCurrentTime(currentTime);
      setDuration(duration);
      setProgress(progress);

      // Find current lyric based on time
      const currentLyric = lyrics.find(lyric => 
        Math.abs(currentTime - lyric.time) < 0.1
      );
      if (currentLyric) {
        setCurrentLyric(currentLyric.text);
      }
    }
  };

  useEffect(() => {
    if (isFlipped) {
      const audio = audioRef.current;
      audio.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [isFlipped]);

  return (
    <div className="start-screen">
      <div className={`welcome-box ${isFlipped ? 'flipped' : ''}`}>
        <div className="welcome-box-inner">
          <div className="welcome-box-front">
            <h1 className="welcome-text">
              Dobrodošla Anamarija Predjelic.<br/>
              Ovo je WebApp unikatan i napravljen<br/>
              samo za tebe
            </h1>
          </div>
          <div className="welcome-box-back" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="welcome-text-overlay">
              <h1 className="welcome-text">
                Ova je pjesma napisana i kreirana<br/>
                <span className="highlight">samo za tebe</span>
              </h1>
              {isPlaying && currentLyric && (
                <div className="lyrics-display">
                  {currentLyric}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="progress-container">
          <span className="time-display">{formatTime(currentTime)}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      )}

      <button className="start-button" onClick={isFlipped ? handlePlayClick : handleStartClick}>
        {isFlipped ? (isPlaying ? 'Pauza' : 'Pokreni') : 'Počnimo'}
      </button>
    </div>
  );
};

export default StartScreen;
