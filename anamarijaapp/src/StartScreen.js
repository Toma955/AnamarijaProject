// src/StartScreen.js
import React, { useState, useRef, useEffect } from 'react';
import './StartScreen.css';
import backgroundImage from './AnaMarija.JPG';
import audioFile from './AnamarijaP.wav';
import lyrics from './lyrics';

const StartScreen = ({ onStart }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSecondFlipped, setIsSecondFlipped] = useState(false);
  const [isThirdFlipped, setIsThirdFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyric, setCurrentLyric] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSongEnded, setIsSongEnded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showSplitButtons, setShowSplitButtons] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [buttonResponse, setButtonResponse] = useState('');
  const [isBlackBackground, setIsBlackBackground] = useState(false);
  const [isInstagramStyle, setIsInstagramStyle] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [isNoButtonInstagram, setIsNoButtonInstagram] = useState(false);
  const phoneNumber = '0950000000';
  const instagramLink = 'https://www.instagram.com/anamarijaperdijic/';
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
        
        // Fade out progress bar with animation
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
          progressContainer.style.animation = 'fadeOut 5s ease-in-out forwards';
          setTimeout(() => {
            progressContainer.classList.add('fade-out');
          }, 5000);
        }

        // Change text after progress bar fades out
        setTimeout(() => {
          setCurrentMessage(1);
        }, 5000);
      }

      // Find current lyric based on time
      const currentLyric = lyrics.find((lyric, index) => {
        const nextLyric = lyrics[index + 1];
        return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
      });
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

  const handleNextClick = () => {
    if (currentMessage === 0) {
      setCurrentMessage(1);
      setDisplayedText(renderMessageContent(1));
    } else if (currentMessage === 1) {
      setIsTransitioning(true);
      
      const welcomeText = document.querySelector('.welcome-text');
      const welcomeBox = document.querySelector('.welcome-box');
      if (welcomeText && welcomeBox) {
        welcomeText.classList.add('fade-out');
        welcomeBox.classList.add('shrink');
      }
      
      const mainButton = document.querySelector('.start-button');
      if (mainButton) {
        mainButton.classList.add('rotated');
        setShowSplitButtons(true);
        setShowBackground(true);
      }
      
      setTimeout(() => {
        setIsSecondFlipped(true);
        setTimeout(() => {
          setCurrentMessage(2);
          setDisplayedText(renderMessageContent(2));
          setIsTransitioning(false);
          if (welcomeText) {
            welcomeText.classList.remove('fade-out');
          }
        }, 400);
      }, 800);
    } else if (currentMessage === 2) {
      setIsThirdFlipped(true);
      setTimeout(() => {
        setCurrentMessage(3);
        setDisplayedText(renderMessageContent(3));
      }, 400);
    }
  };

  const handleButtonClick = (isYes) => {
    if (isYes) {
      setButtonResponse('Hvala ti, javi se na wap (095 000 0000) ili nastavljamo premo Instagrama');
      setIsInstagramStyle(true);
      setIsNoButtonInstagram(true);
    } else {
      if (isNoButtonInstagram) {
        window.open(instagramLink, '_blank');
      } else {
        setButtonResponse('Oprosti na smetnji');
        setIsBlackBackground(true);
        setShowButtons(false);
      }
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      setButtonResponse('Broj je kopiran! Možeš ga sada zalijepiti u WhatsApp');
    }).catch(err => {
      setButtonResponse('Greška pri kopiranju broja. Pokušaj ponovno.');
    });
  };

  const renderMessageContent = (messageType) => {
    switch(messageType) {
      case 0:
        return (
          <h1 className="welcome-text">
            Ova je pjesma napisana i kreirana<br/>
            <span className="highlight">samo za tebe.</span><br/>
            Originalna je, nigdje ne postoji<br/>
            i samo je <span className="highlight">Tvoja.</span>
          </h1>
        );
      case 1:
        return (
          <div className="welcome-text">
            <p>Imaš tu <span className="highlight">supersposobnost</span> inspirirat ljude ako se samo malo uroni u tvoju površinu...</p>
            <p>Mislim da si <span className="highlight">kompletna osoba</span> koja je od putovanja preko gastronomije i mode pa do poduzetništva...</p>
          </div>
        );
      case 2:
        return (
          <div className="welcome-text">
            <p>Pogledaj koliko si <span className="highlight">savršena</span>,</p>
            <p>sve što želim je vidjeti te <span className="highlight">uživo</span>...</p>
            <p>...ako si za...</p>
          </div>
        );
      case 3:
        return (
          <div className="welcome-text">
            <p>Svi naljepši <span className="highlight">ljubavni filmovi</span> i pjesme su napisane tek nakon što si se rodila...</p>
            <p>Ja ne vjerujem u <span className="highlight">slučajnost</span>...</p>
          </div>
        );
      default:
        return null;
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

  useEffect(() => {
    setDisplayedText(renderMessageContent(currentMessage));
  }, [currentMessage]);

  return (
    <div className="start-screen">
      {showBackground && (
        <div 
          className="background-image" 
          style={{ 
            backgroundImage: isBlackBackground ? 'none' : `url(${backgroundImage})`,
            backgroundColor: isBlackBackground ? 'black' : 'transparent'
          }} 
        />
      )}
      {!showSplitButtons && (
        <div className={`welcome-box ${isFlipped ? 'flipped' : ''} ${isSecondFlipped ? 'second-flipped' : ''} ${isThirdFlipped ? 'third-flipped' : ''}`}>
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
                {!isTransitioning && displayedText}
                {currentLyric && !isSongEnded && (
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
      )}

      {showSplitButtons && !buttonResponse && (
        <div className="final-message">
          Jedino što želim je vidljeti savršenu tebe uživo
        </div>
      )}

      {buttonResponse && (
        <div className="button-response">
          {buttonResponse}
        </div>
      )}

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

      {showButtons && (
        <div className="button-container">
          <button 
            className={`start-button ${isFlipped ? 'playing' : ''}`} 
            onClick={isFlipped ? (isSongEnded ? handleNextClick : handlePlayClick) : handleStartClick}
          >
            {isFlipped ? (isPlaying ? 'Pauza' : (isSongEnded ? 'Dalje' : 'Pokreni')) : 'Spremna sam'}
          </button>
          {showSplitButtons && (
            <>
              <button 
                className={`start-button split left ${isInstagramStyle ? 'instagram-style' : ''}`} 
                onClick={isInstagramStyle ? handleCopyNumber : () => handleButtonClick(true)}
              >
                {isInstagramStyle ? 'Kopiraj broj' : 'Da'}
              </button>
              <button 
                className={`start-button split right ${isNoButtonInstagram ? 'instagram-style' : ''}`} 
                onClick={() => handleButtonClick(false)}
              >
                {isNoButtonInstagram ? 'Natrag na Instagram' : 'Ne'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StartScreen;