import React, { useState, useRef, useEffect } from 'react';
import betterswapImage from 'assets/betterswap.jpeg'

const FloatingAd = () => {
  const [position, setPosition] = useState(() => ({
    x: window.innerWidth - 170,
    y: window.innerHeight / 2 - 100
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const adRef = useRef(null);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    const rect = adRef.current.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handleMove = (clientX, clientY) => {
    if (isDragging) {
      setPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleTouchEnd = handleEnd;

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleLaunch = () => {
    window.open('https://swap.tbc.vet', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={adRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '150px',
        height: '200px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none', // Prevents scrolling while dragging on touch devices
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        style={{
          width: '150px',
          height: '150px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img 
          src={betterswapImage} 
          alt="Trade Smart. Trade Better" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            pointerEvents: 'none',
          }} 
        />
      </div>
      <button
        onClick={handleLaunch}
        style={{
          width: '100%',
          height: '50px',
          border: 'none',
          backgroundColor: '#2c9302',
          color: 'white',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Launch BetterSwap
      </button>
    </div>
  );
};

export default FloatingAd;