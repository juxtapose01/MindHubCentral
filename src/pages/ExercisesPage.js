import React, { useState, useEffect } from 'react';

const ExercisesPage = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    let interval;
    if (isBreathing) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev === 1) {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 4;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 6;
            } else {
              setBreathPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathPhase]);

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
    if (!isBreathing) {
      setBreathPhase('Inhale');
      setCount(4);
    }
  };

  return (
    <section className="exercises-page">
      <h2>Breathing Exercise</h2>
      <p>Follow the prompts to practice a calming 4-4-6 breathing technique: inhale for 4 seconds, hold for 4 seconds, exhale for 6 seconds.</p>
      <div className="breathing-circle" data-phase={breathPhase.toLowerCase()}>
        <span>{breathPhase}</span>
        <span>{count}</span>
      </div>
      <button className="breathing-btn" onClick={toggleBreathing}>
        {isBreathing ? 'Stop' : 'Start'}
      </button>
    </section>
  );
};

export default ExercisesPage;