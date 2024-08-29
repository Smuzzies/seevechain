import React from 'react';

const SlidingIframe = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '33%',
        height: '100%',
        backgroundColor: 'white',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <iframe 
        src="https://swap.tbc.vet/" 
        style={{width: '100%', height: '100%', border: 'none'}}
        title="BetterSwap"
      />
    </div>
  );
};

export default SlidingIframe;