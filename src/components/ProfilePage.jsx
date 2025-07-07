import React from 'react';
import Footer from './Footer';

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
    return (
    <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
        <div className="flex-1 flex flex-col">
            <div className="w-full h-32 overflow-hidden">
                <img src={libraryBackground} alt="Background" className="w-full h-full object-cover" />
            </div>

            <div className="-mt-15 text-center relative">
                <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white mx-auto" />
                <h2 className="text-2xl mt-2">University Student</h2>
                <p className="text-left ml-3 max-w-md mx-auto mt-1 text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ornare ex id velit finibus, sit amet ultricies mi venenatis. Nulla enim arcu, dictum sed tempor sit amet, lobortis ut sem. Nullam tristique dictum orci dapibus sollicitudin. Sed vel odio ut sapien semper efficitur in eget diam.</p>
                <div className="flex justify-center mt-1">
                    <div className="text-center mx-5">
                        <h3 className="text-2xl m-0">55</h3>
                        <p className="m-0 text-gray-500 text-sm">Conexões</p>
                    </div>
                    <div className="text-center mx-5">
                        <h3 className="text-2xl m-0">100</h3>
                        <p className="m-0 text-gray-500 text-sm">Pontuação</p>
                    </div>
                </div>
            </div>

            <button className="block mx-auto mt-5 py-3 px-8 bg-green-700 text-white w-11/12  rounded-full font-medium text-base hover:bg-green-800 transition">
                Connect
            </button>

            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-3 mx-auto mt-5 w-11/12">
                <img src={exampleImage1} alt="Example 1" className="w-full h-auto rounded-lg" />
                <img src={exampleImage2} alt="Example 2" className="w-full h-auto rounded-lg" />
                <img src={exampleImage3} alt="Example 3" className="w-full h-auto rounded-lg" />
                <img src={exampleImage4} alt="Example 4" className="w-full h-auto rounded-lg" />
                <img src={exampleImage5} alt="Example 5" className="w-full h-auto rounded-lg" />
                <img src={exampleImage6} alt="Example 6" className="w-full h-auto rounded-lg" />
                <img src={exampleImage7} alt="Example 7" className="w-full h-auto rounded-lg" />
                <img src={exampleImage8} alt="Example 8" className="w-full h-auto rounded-lg" />
            </div>
        </div>
        <Footer />
    </div>
);
};

export default ProfilePage;