import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '132, 0, 255';

const BentoPanel = ({
  children,
  className = '',
  style = {},
  glowColor = DEFAULT_GLOW_COLOR,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  enableStars = true,
  enableTilt = true,
  clickEffect = true,
  particleCount = 15
}) => {
  const panelRef = useRef(null);
  const spotlightRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);

  // Spotlight Logic
  useEffect(() => {
    const spotlight = document.createElement('div');
    spotlight.className = 'panel-spotlight';
    spotlight.style.cssText = `
      position: absolute;
      width: ${spotlightRadius * 2}px;
      height: ${spotlightRadius * 2}px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%,
        rgba(${glowColor}, 0.06) 20%,
        rgba(${glowColor}, 0.02) 40%,
        transparent 70%
      );
      z-index: 1;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    panelRef.current?.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e) => {
      if (!panelRef.current || !spotlightRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight position
      gsap.to(spotlightRef.current, {
        left: x,
        top: y,
        duration: 0.1,
        ease: 'power2.out'
      });

      // Update border glow variables
      const relativeX = (x / rect.width) * 100;
      const relativeY = (y / rect.height) * 100;
      panelRef.current.style.setProperty('--glow-x', `${relativeX}%`);
      panelRef.current.style.setProperty('--glow-y', `${relativeY}%`);
      panelRef.current.style.setProperty('--glow-intensity', '1');
      panelRef.current.style.setProperty('--glow-radius', `${spotlightRadius}px`);

      if (spotlightRef.current.style.opacity === '0') {
        gsap.to(spotlightRef.current, { opacity: 1, duration: 0.3 });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
      panelRef.current?.style.setProperty('--glow-intensity', '0');
    };

    panelRef.current?.addEventListener('mousemove', handleMouseMove);
    panelRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      panelRef.current?.removeEventListener('mousemove', handleMouseMove);
      panelRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      spotlight.remove();
    };
  }, [glowColor, spotlightRadius]);

  // Particle Logic (Stars)
  const animateParticles = useCallback(() => {
    if (!enableStars || !panelRef.current) return;
    const { width, height } = panelRef.current.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !panelRef.current) return;

        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(${glowColor}, 0.8);
          left: ${Math.random() * width}px;
          top: ${Math.random() * height}px;
          pointer-events: none;
          z-index: 2;
        `;
        panelRef.current.appendChild(p);
        particlesRef.current.push(p);

        gsap.fromTo(p, { scale: 0, opacity: 0 }, { 
          scale: 1, 
          opacity: 0.6, 
          duration: 0.5,
          y: '-=20',
          x: `+=${(Math.random() - 0.5) * 40}`,
          onComplete: () => {
            gsap.to(p, { 
              opacity: 0, 
              scale: 0, 
              duration: 1, 
              onComplete: () => p.remove() 
            });
          }
        });
      }, i * 200);
      timeoutsRef.current.push(timeoutId);
    }
  }, [enableStars, glowColor, particleCount]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animateParticles]);

  return (
    <div
      ref={panelRef}
      className={`magic-bento-panel magic-bento-panel--border-glow ${className}`}
      style={{
        '--glow-color': glowColor,
        background: 'rgba(18, 15, 23, 0.85)', // Consistent opacity
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        ...style
      }}
    >
      <div style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
};

export default BentoPanel;
