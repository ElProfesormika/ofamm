"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animationType?: "fade" | "slide-left" | "slide-right" | "scale";
  delay?: number;
  threshold?: number;
}

export function ScrollAnimation({
  children,
  className = "",
  animationType = "fade",
  delay = 0,
  threshold = 0.1,
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, threshold]);

  const animationClass = {
    fade: "fade-in-on-scroll",
    "slide-left": "slide-in-left-on-scroll",
    "slide-right": "slide-in-right-on-scroll",
    scale: "scale-in-on-scroll",
  }[animationType];

  return (
    <div
      ref={ref}
      className={`${animationClass} ${isVisible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

