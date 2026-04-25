import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  text = "",
  className = "",
  delay = 50,
  duration = 0.8,
  ease = "power3.out",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = "center",
  onLetterAnimationComplete
}) => {
  const containerRef = useRef(null);

  // Manually split text into characters to avoid dependency on premium GSAP SplitText plugin
  const words = text.split(" ").map(word => word.split(""));

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      }
    });

    tl.fromTo(
      containerRef.current.querySelectorAll('.split-char'),
      { ...from },
      {
        ...to,
        duration: duration,
        ease: ease,
        stagger: delay / 1000,
        onComplete: () => {
          if (onLetterAnimationComplete) onLetterAnimationComplete();
        }
      }
    );
  }, { scope: containerRef, dependencies: [text] });

  return (
    <div
      ref={containerRef}
      className={`split-parent ${className}`}
      style={{ textAlign, display: 'inline-block', width: '100%' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.map((char, charIndex) => (
            <span
              key={charIndex}
              className="split-char"
              style={{ display: 'inline-block', willChange: 'transform, opacity' }}
            >
              {char}
            </span>
          ))}
          <span style={{ display: 'inline-block' }}>&nbsp;</span>
        </span>
      ))}
    </div>
  );
};

export default SplitText;
