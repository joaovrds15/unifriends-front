import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ path }) => {
  const navigate = useNavigate();

  const handleBackNavigation = () => {
    if (path) {
      navigate(path);
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      onClick={handleBackNavigation}
      className="text-[#0d151c] flex size-12 shrink-0 items-center cursor-pointer"
      data-icon="ArrowLeft"
      data-size="24px"
      data-weight="regular"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
      </svg>
    </div>
  );
};

export default BackButton;