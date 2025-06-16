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
  const [isSongEnded, setIsSongEnded] = useState(false);
  const audioRef = useRef(new Audio(audioFile));

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartClick = () => {
    setIsFlipped(true);
    setTimeout(() => {
      const progressContainer = document.querySelector('.progress-container');
      if (progressContainer) {
        progressContainer.classList.add('visible');
      }
    }, 500);
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

      // Check if song has ended
      if (currentTime >= duration) {
        setIsSongEnded(true);
        setIsPlaying(false);
        audioRef.current.pause();
      }

      // Find current lyric based on time
      const currentLyric = lyrics.find(lyric => 
        Math.abs(currentTime - lyric.time) < 0.1
      );
      if (currentLyric) {
        setCurrentLyric(currentLyric.text);
      }
    }
  };

  const handleProgressBarClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = clickPosition * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleProgressBarDrag = (e) => {
    if (audioRef.current && e.buttons === 1) { // Check if left mouse button is pressed
      const progressBar = e.currentTarget;
      const dragPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = dragPosition * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
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
              Dobrodošla Miss<br/>
              <span className="highlight">Anamarija Predjelic</span><br/>
              u webapp stvoreno<br/>
              samo za tebe.<br/><br/>
              ...Inspiriraš ljude<br/>
              bez da se trudiš...<br/><br/>
              Jesi spremna?<br/><br/>
              
            </h1>
          </div>
          <div className="welcome-box-back" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="welcome-text-overlay">
              <h1 className="welcome-text">
                Ova je pjesma napisana i kreirana<br/>
                <span className="highlight">samo za tebe.</span><br/>
                Originalna je, nigdje ne postoji<br/>
                i samo je <span className="highlight">Tvoja.</span>
              </h1>
              {isPlaying && currentLyric && !isSongEnded && (
                <div className="lyrics-container">
                  <div className="lyrics-display">
                    {currentLyric}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFlipped && !isSongEnded && (
        <div className={`progress-container ${isSongEnded ? 'fade-out' : ''}`}>
          <span className="time-display">{formatTime(currentTime)}</span>
          <div 
            className="progress-bar"
            onClick={handleProgressBarClick}
            onMouseMove={handleProgressBarDrag}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      )}

      <button 
        className={`start-button ${isFlipped ? 'playing' : ''}`} 
        onClick={isFlipped ? handlePlayClick : handleStartClick}
      >
        {isFlipped ? (isPlaying ? 'Pauza' : (isSongEnded ? 'Dalje' : 'Pokreni')) : 'Spremna sam'}
      </button>
    </div>
  );
};

export default StartScreen;
