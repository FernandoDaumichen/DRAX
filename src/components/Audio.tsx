import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

type BarProps = {
  height: number; // The target height of the bar
};

const AnimatedBar: React.FC<BarProps> = ({ height }) => {
  const animationStyle = useSpring({
    from: { height: 0 },
    to: { height },
    config: { tension: 130, friction: 20 }
  });

  return (
    <animated.div
      className="bg-purple-400" // Using Tailwind CSS for purple background
      style={{
        ...animationStyle,
        width: '10px',
        margin: '0 2px',
        height: animationStyle.height.to(h => `${h}px`), // Use pixels for direct control
      }}
    />
  );
};

type WaveformProps = {
  numBars: number; // Number of bars in the waveform
};

const Waveform: React.FC<WaveformProps> = ({ numBars }) => {
  const [barHeights, setBarHeights] = useState<number[]>([]);

  // Function to generate heights that are larger
  const generateHeights = () => {
    // Ensuring that bars are always at least 80% of the container height
    return Array.from({ length: numBars }, () => 30 + Math.random() * 50); // Heights will range from 80 to 100%
  };

  // Update the bar heights at a regular interval
  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(generateHeights());
    }, 500); // Update interval remains the same

    return () => clearInterval(interval);
  }, [numBars]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px' }}> {/* Adjusted for visual appeal */}
      {barHeights.map((height, index) => (
        <AnimatedBar key={index} height={height} />
      ))}
    </div>
  );
};

export default Waveform;
