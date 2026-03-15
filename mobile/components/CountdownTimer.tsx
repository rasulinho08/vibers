import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const totalHours = Math.floor(distance / (1000 * 60 * 60));
      setTimeLeft({
        hours: totalHours,
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <Text style={styles.timer}>
      {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});
