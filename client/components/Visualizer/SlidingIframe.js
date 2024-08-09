import React from 'react';

const SlidingIframe = ({ isOpen, onClose }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: isOpen ? '33%' : '0%',
        height: '100%',
        transition: 'width 0.3s ease-in-out',
        overflow: 'hidden',
        boxShadow: isOpen ? '-2px 0 5px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {isOpen && (
        <iframe 
          src="https://swap.tbc.vet/" 
          style={{width: '100%', height: '100%', border: 'none'}}
          title="BetterSwap"
        />
      )}
    </div>
  );
};

export default SlidingIframe;