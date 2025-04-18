import React, { useState, useEffect } from 'react';

const NotificationTimer = () => {
  const [timeLeft, setTimeLeft] = useState(7200); // 2 часа в секундах

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      alert('Прошло 2 часа!');
      setTimeLeft(7200); // Сбросить таймер
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}ч ${mins}м ${secs}с`;
  };

  return (
    <div>
      <p>{formatTime(timeLeft)}</p>
    </div>
  );
};

export default NotificationTimer;
