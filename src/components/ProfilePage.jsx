import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useUser } from '../context/UserContext';
import { getUserProfile, getMyOwnProfile } from '../services/userService';
import libraryBackground from '../temp/Image.png';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const isMyProfile = !userId || (user && user.id === parseInt(userId));

    useEffect(() => {
        const fetchProfile = async () => {
            const idToFetch = isMyProfile ? user.id : userId;
            if (!idToFetch) {
                setIsLoading(false);
                setError("User ID not found.");
                return;
            }

            try {
                setIsLoading(true);
                if (isMyProfile) {
                    const response = await getMyOwnProfile();
                    setProfile(response.data.data);
                    return;
                }

                const response = await getUserProfile(idToFetch);
                setProfile(response.data.data);
            } catch (err) {
                setError("Failed to load profile.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userId, user, isMyProfile]);

    const renderConnectButton = () => {
        if (isMyProfile) {
            return (
                <button className="block mx-auto mt-5 py-3 px-8 bg-gray-400 text-white w-11/12 rounded-full font-medium text-base hover:bg-gray-500 transition">
                    Editar
                </button>
            );
        }

        if (profile.has_connection) {
            // Assuming you need to find the connection id to navigate to chat
            // This part might need adjustment based on your API capabilities
            return (
                <button onClick={() => navigate(`/messages`)} className="block mx-auto mt-5 py-3 px-8 bg-green-600 text-white w-11/12 rounded-full font-medium text-base hover:bg-green-800 transition">
                    Mensagens
                </button>
            );
        }

        if (profile.has_pending_connection_request) {
            return (
                <button disabled className="block mx-auto mt-5 py-3 px-8 bg-gray-300 text-gray-600 w-11/12 rounded-full font-medium text-base cursor-not-allowed">
                    Aguardando aprovação
                </button>
            );
        }

        return (
            <button className="block mx-auto mt-5 py-3 px-8 bg-blue-500 text-white w-11/12 rounded-full font-medium text-base hover:bg-blue-600 transition">
                Conectar
            </button>
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-screen max-w-md bg-white mx-auto items-center justify-center">
                <div className="border-4 border-blue-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col h-screen max-w-md bg-white mx-auto items-center justify-center">
                <p className="text-red-500">{error || "Profile not found."}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
            <div className="flex-1 flex flex-col">
                <div className="w-full h-32 overflow-hidden">
                    <img src={libraryBackground} alt="Background" className="w-full h-full object-cover" />
                </div>

                <div className="-mt-15 text-center relative">
                    <img src={profile.profile_picture_url} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white mx-auto object-cover" />
                    <h2 className="text-2xl mt-2">{profile.name}</h2>
                    <p className="text-left p-3 max-w-md mx-auto mt-1 text-gray-700">{profile.description}</p>
                    <div className="flex justify-center mt-1">
                        <div className="text-center mx-5">
                            <h3 className="text-2xl m-0">{profile.connection_count ?? 0}</h3>
                            <p className="m-0 text-gray-500 text-sm">Conexões</p>
                        </div>
                        <div className="text-center mx-5">
                            <h3 className="text-2xl m-0">{profile.score ?? 0}</h3>
                            <p className="m-0 text-gray-500 text-sm">Pontuação</p>
                        </div>
                    </div>
                </div>

                {renderConnectButton()}

                <div className="grid grid-cols-3 gap-3 mx-auto mt-5 w-11/12">
                    {profile.images && profile.images.map((image) => (
                        <img key={image.id} src={image.image_url} alt={`User image ${image.id}`} className="w-full h-24 object-cover rounded-lg" />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;