// components/LoadingOverlay.jsx
import React from 'react';
import Lottie from 'lottie-react';
import coffeeAnimation from '../assets/images/coffee.json';

const LoadingOverlay = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Lottie animationData={coffeeAnimation} loop autoplay style={{ width: 500, height: 500 }} />
    </div>
  );
};

export default LoadingOverlay;
