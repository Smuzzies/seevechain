import React, { useState, useRef, useEffect } from 'react';
import betterswapImage from 'assets/betterswap.jpg'

const FloatingAd = () => {
  const [position, setPosition] = useState(() => ({
    x: window.innerWidth - 170,
    y: window.innerHeight - 250
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const adRef = useRef(null);
  const dragStartTimeRef = useRef(null);
  const hasDraggedRef = useRef(false);

  const handleStart = (clientX, clientY) => {
    const rect = adRef.current.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    setIsDragging(true);
    dragStartTimeRef.current = Date.now();
    hasDraggedRef.current = false;
  };

  const handleMove = (clientX, clientY) => {
    if (isDragging) {
      setPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
      hasDraggedRef.current = true;
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    const dragDuration = Date.now() - dragStartTimeRef.current;
    if (dragDuration < 200 && !hasDraggedRef.current) {
      handleLinkClick();
    }
  };

  const handleLinkClick = () => {
    window.open('https://swap.tbc.vet', '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  return (
    <div
      ref={adRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '150px',
        height: '190px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        zIndex: 9999,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
      }}
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
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
            userSelect: 'none',
          }} 
        />
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleLinkClick();
        }}
        style={{
          width: '100%',
          height: '40px',
          border: 'none',
          backgroundColor: '#2c9302',
          color: 'white',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <center><b>Click here to Launch BetterSwap</b></center>
      </div>
    </div>
  );
};

export default FloatingAd;