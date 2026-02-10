import { useEffect, useState } from 'react';

const FULL_TEXT = 'Helping Students • Completing Projects • Supporting Businesses';
const TYPING_SPEED = 50;
const PAUSE_DURATION = 2000;

export default function TypingHeroText() {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < FULL_TEXT.length) {
        timeout = setTimeout(() => {
          setDisplayText(FULL_TEXT.slice(0, displayText.length + 1));
        }, TYPING_SPEED);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, PAUSE_DURATION);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, TYPING_SPEED / 2);
      } else {
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping]);

  return (
    <div className="h-16 flex items-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-gradient">
        {displayText}
        <span className="animate-pulse text-primary">|</span>
      </h2>
    </div>
  );
}
