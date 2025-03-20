import React from 'react';
import '../components/components_css/Footer.css';
import profile from '../icons/profile.svg';
import affinity from '../icons/affinity.svg';
import pencil from '../icons/pencil.svg';
import search from '../icons/search.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={affinity} alt='logo-handshake' className="footer-button"/>
      <img src={search} alt='logo-magnifying-glass' className="footer-button"/>
      <img src={pencil} alt='pencil-answer' className="footer-button"/>
      <img src={profile} alt='profile-icon' className="footer-button"/>
    </footer>
  );
};

export default Footer;