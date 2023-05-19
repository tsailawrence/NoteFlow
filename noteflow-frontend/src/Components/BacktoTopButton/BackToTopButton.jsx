import React, { useState, useEffect } from 'react';
import './BackToTopButton.scss';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

const BackToTopButton = ({ containerRef }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    if (containerRef.current.scrollTop < 300) setVisible(false);
    else setVisible(true);
  };

  const scrollToTop = () => {
    containerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const containerElement = containerRef.current;
    containerElement.addEventListener('scroll', toggleVisibility);
    return () =>
      containerElement.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {visible && (
        <button onClick={scrollToTop} className="back-to-top-btn">
          <KeyboardDoubleArrowUpIcon />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
