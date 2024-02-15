import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

type BarProps = {
  height: number; 
};

const AnimatedBar: React.FC<BarProps> = ({ height }) => {
  const animationStyle = useSpring({
    from: { height: 0 },
    to: { height },
    config: { tension: 130, friction: 20 }
  });

  return (
    <animated.div
      className="bg-purple-400"
      style={{
        ...animationStyle,
        width: '10px',
        margin: '0 2px',
        height: animationStyle.height.to(h => `${h}px`),
      }}
    />
  );
};

type WaveformProps = {
  numBars: number; 
};

const Waveform: React.FC<WaveformProps> = ({ numBars }) => {
  const [barHeights, setBarHeights] = useState<number[]>([]);

  const generateHeights = () => {
    return Array.from({ length: numBars }, () => 30 + Math.random() * 50); 
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(generateHeights());
    }, 500); 

    return () => clearInterval(interval);
  }, [numBars]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px' }}> 
      {barHeights.map((height, index) => (
        <AnimatedBar key={index} height={height} />
      ))}
    </div>
  );
};

export default Waveform;
