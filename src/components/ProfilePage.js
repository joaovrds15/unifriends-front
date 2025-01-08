import React, {useEffect, useState} from 'react';
import '../components/components_css/ProfilePage.css';
import profilePic from '../temp/profile.png';
import libraryBackground from '../temp/Image.png';
import exampleImage1 from '../temp/profile.png';
import exampleImage2 from '../temp/profile.png';
import exampleImage3 from '../temp/profile.png';
import exampleImage4 from '../temp/profile.png';
import exampleImage5 from '../temp/profile.png';
import exampleImage6 from '../temp/profile.png';
import exampleImage7 from '../temp/profile.png';
import exampleImage8 from '../temp/profile.png';

const ProfilePage = () => {
    const [profilPic, setProfilePic] = useState('');

    return (
        <div className="profile-container">
            <div className="background-image">
                <img src={libraryBackground} alt="Background" className="background-img" />
            </div>

            <div className="profile-section">
                <img src={profilePic} alt="Profile" className="profile-pic" />
                <h2>University Student</h2>

                <div className="stats-container">
                    <div className="stat">
                        <h3>55</h3>
                        <p>Conexões</p>
                    </div>
                    <div className="stat">
                        <h3>100</h3>
                        <p>Pontuação</p>
                    </div>
                </div>
            </div>

            <button className="connect-btn">Connect</button>

            {/* Image Grid */}
            <div className="image-grid">
                <img src={exampleImage1} alt="Example 1" />
                <img src={exampleImage2} alt="Example 2" />
                <img src={exampleImage3} alt="Example 3" />
                <img src={exampleImage4} alt="Example 4" />
                <img src={exampleImage5} alt="Example 5" />
                <img src={exampleImage6} alt="Example 6" />
                <img src={exampleImage7} alt="Example 7" />
                <img src={exampleImage8} alt="Example 8" />
            </div>
        </div>
    );
};

export default ProfilePage;