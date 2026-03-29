import React, { useEffect, useState } from 'react';

function Splash() {
  const [dots, setDots] = useState('...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animate dots
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 500);

    // Load for 3 seconds then redirect
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        window.location.href = '/home';
      }, 500);
    }, 3000);

    // Cleanup
    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #d3dcba 0%, #6b8464 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: 'white',
      zIndex: 9999,
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease-out'
    }}>
      <div style={{
        marginBottom: '30px',
        animation: 'float 3s ease-in-out infinite'
      }}>
        <img 
          src="logo.jpg" 
          alt="cooking logo" 
          style={{ 
            width: '180px', 
            height: 'auto', 
            borderRadius: '10px',
            display: 'block',
            margin: '0 auto' // This ensures center alignment
          }} 
        />
      </div>
      
      <h1 style={{ 
        fontSize: '42px', 
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        color: 'white',
        position: 'relative', // Override any absolute positioning
        left: 'auto', // Reset any left positioning
        transform: 'none' // Reset any transforms
      }}>
        Cooking Dishes
      </h1>
      
      <div style={{
        width: '80px',
        height: '80px',
        border: '8px solid rgba(255, 255, 255, 0.3)',
        borderTop: '8px solid white',
        borderRadius: '50%',
        margin: '30px auto',
        animation: 'spin 1s linear infinite'
      }}></div>
      
      <div style={{ 
        fontSize: '20px', 
        marginTop: '20px',
        color: 'rgba(255, 255, 255, 0.9)'
      }}>
        Loading<span style={{ display: 'inline-block', width: '30px' }}>{dots}</span>
      </div>

      {/* Add keyframe animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Splash;