import { useEffect, useState } from 'react';

export default function LogoBackground({ bottomSize = '10%', rightSize = '2%' }) {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);
  return (
    <>
      {screenSize.width >= 1000 && screenSize.height >= 600 && (
        <img
          className="img-fluid"
          src={`/img/v1/backdrop-logo.png`}
          alt="ONEFORCE"
          style={{
            width: '280px',
            position: 'absolute',
            bottom: bottomSize,
            right: rightSize,
            zIndex: -10,
          }}
        />
      )}
    </>
  );
}
