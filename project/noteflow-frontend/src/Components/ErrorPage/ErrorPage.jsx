import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigateTo = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      navigateTo('/home');
      clearInterval(timer);
    }, 3000);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        textJustify: 'center',
        flexDirection: 'column',
      }}
    >
      <h1 style={{}}>你沒有權限，三秒後將你遣返!</h1>
    </div>
  );
};

export default ErrorPage;
