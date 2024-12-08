import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function LogoWithText({ textSize = 17, imageSize = 32, src = null, size = 2, showText = false }) {
  const [imgSize, setImgSize] = useState(imageSize);
  const [txtSize, setTxtSize] = useState(textSize);
  const navigate = useNavigate();

  useMemo(() => {
    setImgSize(imgSize * (size / 2));
    setTxtSize(txtSize * (size / 2));
  }, [size]);

  return (
    <div className="gx-login-header gx-text-center">
      <img
        className="img-fluid"
        src={`/img/v1/main-logo.png`}
        alt="ONEFORCE"
        style={{ width: imgSize }}
        onClick={() => src && (window.location.href = src)}
      />
      {showText && (
        <strong
          style={{ fontSize: txtSize || 'x-large', marginLeft: '10px', color: '#fff' }}
          onClick={() => src && navigate(src)}
        >
          ONE FORCE
        </strong>
      )}
    </div>
  );
}
