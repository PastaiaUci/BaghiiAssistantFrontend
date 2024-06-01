import React from 'react';
import Lottie from 'react-lottie';
import animationData from './voice-animation.json'; 

const VoiceAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return <Lottie options={defaultOptions} height={200} width={600} />;
};

export default VoiceAnimation;
