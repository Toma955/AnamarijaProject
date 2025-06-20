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
  const phoneNumber = '0955709282';
  const instagramLink = 'https://www.instagram.com/anamarijaperdijic/';
  const audioRef = useRef(new Audio(audioFile));

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartClick = () => {
    setIsFlipped(true);
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.classList.add('clicked');
    }
    const iconsContainer = document.querySelector('.icons-container');
    if (iconsContainer) {
      iconsContainer.classList.add('show-headset-indicator');
    }
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
    if (audioRef.current && e.buttons === 1) { 
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
      // Move circle to info icon
      const iconsContainer = document.querySelector('.icons-container');
      if (iconsContainer) {
        iconsContainer.classList.add('show-info-indicator');
      }
    } else if (currentMessage === 1) {
      // Move circle to question mark icon
      const iconsContainer = document.querySelector('.icons-container');
      if (iconsContainer) {
        iconsContainer.classList.add('show-question-indicator');
      }
      
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
      setButtonResponse(`Hvala ti, javi se na wap ili nastavljamo pricat na instagramu`);
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
            <p>Mislim da si <span className="highlight">kompletna osoba</span> koja je od putovanja preko gastronomije i mode pa do poduzetništva izgradila sebe cijelu ali mislim da zaslužuješ puno više...</p>
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
      <div className="icons-container">
        <div className="icon-item">
          <i className="fa-solid fa-play"></i>
        </div>
        <div className="icon-item">
          <i className="fa-solid fa-headphones"></i>
        </div>
        <div className="icon-item">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <div className="icon-item">
          <i className="fa-solid fa-circle-question"></i>
        </div>
      </div>
      <div className="landscape-warning">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/>
        </svg>
        <p>Molimo okrenite uređaj u vertikalni položaj za najbolje iskustvo</p>
      </div>
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
                Dobrodošla miss<br/>
                <span className="highlight">Anamarija Predjelic</span><br/>
                ...u webapp stvoren za tebe,<br/>
                sa domenom tvoga imena,<br/>
                potpuni inspiriran sa tobom...<br/><br/>
                ...mislim da zaslužuješ<br/>
                nešto unikatno...<br/><br/>
                Nadam se da imaš slušalice<br/>
                i da si spremna?<br/><br/>
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
          Jedino što želim vidjet je ovu savršenu tebe uživo
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
          {!showSplitButtons && (
            <button 
              className={`start-button ${isFlipped ? 'playing' : ''}`} 
              onClick={isFlipped ? (isSongEnded ? handleNextClick : handlePlayClick) : handleStartClick}
            >
              {isFlipped ? (isPlaying ? 'Pauza' : (isSongEnded ? 'Dalje' : 'Pokreni')) : 'Spremna sam'}
            </button>
          )}
          {showSplitButtons && (
            <>
              <button 
                className={`start-button split left ${isInstagramStyle ? 'instagram-style' : ''}`} 
                onClick={isInstagramStyle ? handleCopyNumber : () => handleButtonClick(true)}
              >
                {isInstagramStyle ? 'Kopiraj' : 'Može'}
              </button>
              <button 
                className={`start-button split right ${isNoButtonInstagram ? 'instagram-style' : ''}`} 
                onClick={() => handleButtonClick(false)}
              >
                {isNoButtonInstagram ? 'Natrag na Instagram' : 'Ne hvala'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StartScreen;