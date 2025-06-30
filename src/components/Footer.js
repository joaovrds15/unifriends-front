import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/components_css/Footer.css';
import profile from '../icons/profile.svg';
import affinity from '../icons/affinity.svg';
import pencil from '../icons/pencil.svg';
import search from '../icons/search.svg';

const Footer = () => {
  const navigate = useNavigate();

  const handlePencilClick = () => {
    navigate('/affinity-quiz');
  };

  const handleAffinityClick = () => {
    navigate('/affinity');
  };

  return (
    <footer className="footer">
      <img src={affinity} alt='logo-handshake' className="footer-button" onClick={handleAffinityClick}/>
      <img src={search} alt='logo-magnifying-glass' className="footer-button"/>
      <img 
        src={pencil} 
        alt='pencil-answer' 
        className="footer-button"
        onClick={handlePencilClick}
      />
      <img src={profile} alt='profile-icon' className="footer-button"/>
    </footer>
  );
};

export default Footer;