import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({ 
  end, 
  duration = 2, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startValue + (endValue - startValue) * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}
