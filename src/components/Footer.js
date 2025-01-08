import React from 'react';
import '../components/components_css/Footer.css';
import profile from '../icons/profile.svg';
import affinity from '../icons/affinity.svg';
import pencil from '../icons/pencil.svg';
import search from '../icons/search.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={affinity} alt='logo-handshake' className="footer-button" style={{ width: '25px', height: '25px' }} />
      <img src={search} alt='logo-magnifying-glass' className="footer-button" style={{ width: '25px', height: '25px' }} />
      <img src={pencil} alt='pencil-answer' className="footer-button" style={{ width: '25px', height: '25px' }} />
      <img src={profile} alt='profile-icon' className="footer-button" style={{ width: '25px', height: '25px' }} />
    </footer>
  );
};

export default Footer;