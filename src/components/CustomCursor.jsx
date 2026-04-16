import { useEffect, useRef } from 'react';
import './index.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + 'px';
        cursorRef.current.style.top = my + 'px';
      }
    };

    let animId;
    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      animId = requestAnimationFrame(animRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animRing();

    // Global Hover effect using event delegation
    const handleMouseEnter = (e) => {
      const target = e.target;
      if (target.closest('button, a, .mini-card, .p-card, .s-card, .pr-card')) {
        if (cursorRef.current) { cursorRef.current.style.width = '6px'; cursorRef.current.style.height = '6px'; }
        if (ringRef.current) { ringRef.current.style.width = '56px'; ringRef.current.style.height = '56px'; ringRef.current.style.opacity = '0.8'; }
      }
    };

    const handleMouseLeave = (e) => {
      const target = e.target;
      if (target.closest('button, a, .mini-card, .p-card, .s-card, .pr-card')) {
        if (cursorRef.current) { cursorRef.current.style.width = '12px'; cursorRef.current.style.height = '12px'; }
        if (ringRef.current) { ringRef.current.style.width = '36px'; ringRef.current.style.height = '36px'; ringRef.current.style.opacity = '0.5'; }
      }
    };

    window.addEventListener('mouseover', handleMouseEnter);
    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseEnter);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
    </>
  );
};

export default CustomCursor;
