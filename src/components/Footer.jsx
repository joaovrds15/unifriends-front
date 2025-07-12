import React from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../icons/profile.svg';
import affinity from '../icons/affinity.svg';
import pencil from '../icons/pencil.svg';
import search from '../icons/search.svg';
import chat from '../icons/chat.svg';
import connectionRequest from '../icons/add-friend.svg';

const Footer = () => {
  const navigate = useNavigate();

  const handlePencilClick = () => {
    navigate('/affinity-quiz');
  };

  const handleAffinityClick = () => {
    navigate('/affinity');
  };

  const handleRequestsClick = () => {
    navigate('/connection-requests');
  };

  return (
    <footer className="flex justify-around py-2 bg-white border-t border-gray-300">
      <img
        src={affinity}
        alt="logo-handshake"
        className="w-6 h-6 cursor-pointer"
        onClick={handleAffinityClick}
      />
      <img
        src={search}
        alt="logo-magnifying-glass"
        className="w-6 h-6 cursor-pointer"
      />
      <img
        src={connectionRequest}
        alt="logo-friend-request"
        className="w-6 h-6 cursor-pointer"
        onClick={handleRequestsClick}
      />
      <img
        src={pencil}
        alt="pencil-answer"
        className="w-6 h-6 cursor-pointer"
        onClick={handlePencilClick}
      />
      <img
        src={chat}
        alt="chat"
        className="w-6 h-6 cursor-pointer"
        onClick={handlePencilClick}
      />
      <img
        src={profile}
        alt="profile-icon"
        className="w-6 h-6 cursor-pointer"
      />
    </footer>
  );
};

export default Footer;