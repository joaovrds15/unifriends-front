import React, { useState, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import profileAvatar from '../icons/user.png';
import addIcon from '../icons/add.svg';
import xIcon from '../icons/close.svg';
import Toast from './Toast';
import libraryBackground from '../temp/Image.png';
import { RegistrationContext } from '../context/RegistrationContext';
import { uploadProfilePicture, uploadUserImage } from '../services/userService';

const UploadImagesPage = () => {
    const navigate = useNavigate();

    const [profilePic, setProfilePic] = useState(profileAvatar);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [gridImages, setGridImages] = useState(Array(7).fill(null));
    const { registrationData, setRegistrationData } = useContext(RegistrationContext);
    const [error, setError] = useState(null);

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfilePic(imageUrl);
            setProfilePicFile(file);
            setIsImageUploaded(true);
        }
    };

    const handleProfileImageClick = (event) => {
        if (isImageUploaded && event.target.dataset.action === "Remove") {
            setProfilePic(profileAvatar);
            setProfilePicFile(null);
            setIsImageUploaded(false);
        } else {
            document.getElementById("fileInput").click();
        }
    };

    const handleGridImageChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const updatedGridImages = [...gridImages];
            updatedGridImages[index] = { imageUrl, file };
            setGridImages(updatedGridImages);
        }
    };

    const handleRemoveGridImage = (index) => {
        const updatedGridImages = [...gridImages];
        updatedGridImages[index] = null;
        setGridImages(updatedGridImages);
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadUserImage(formData)
        } catch (error) {
            setError("Erro ao enviar imagem. Tente novamente mais tarde");
        }
        return null;
    };

    const uploadProfileImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadProfilePicture(formData)
        } catch (error) {
            setError("Erro ao enviar imagem. Tente novamente mais tarde");
        }
        return null;
    };

    const handleSaveImages = async () => {
        if (profilePicFile) {
            await uploadProfileImage(profilePicFile);
        }

        await Promise.all(
            gridImages.map(async (gridImage) => {
                if (gridImage && gridImage.file) {
                    await uploadImage(gridImage.file);
                }
            })
        );
        navigate('/affinity-quiz');
    };

    const hasUploadedImages = profilePicFile || gridImages.some(image => image !== null);

    return (
        <div className="flex flex-col items-center font-sans pb-5 max-w-lg mx-auto">
            <Toast message={error} onClose={() => setError(null)} />
            <div className="w-full h-32 overflow-hidden">
                <img src={libraryBackground} alt="Background" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col items-center relative -mt-12">
                <div
                    className="relative w-24 h-24 flex items-center justify-center"
                    onClick={handleProfileImageClick}
                >
                    <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-2 border-white object-cover" />
                    <img
                        src={isImageUploaded ? xIcon : addIcon}
                        alt={isImageUploaded ? "Remove" : "Add"}
                        data-action={isImageUploaded ? "Remove" : "Add"}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full p-1 cursor-pointer border border-gray-200"
                    />
                </div>
                <h2 className="text-2xl mt-2 font-semibold">Adicione suas imagens</h2>
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                />
            </div>

            <button
                className="mt-5 py-3 px-8 bg-green-600 text-white w-11/12 rounded-full font-medium text-base hover:bg-green-800 transition"
                onClick={handleSaveImages}
            >
                {hasUploadedImages ? 'Salvar' : 'Continuar'}
            </button>

            <div className="grid grid-cols-3 gap-3 mt-5 w-11/12">
                {gridImages.map((gridImage, index) => (
                    <div className="relative" key={index}>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => handleGridImageChange(event, index)}
                            id={`gridFileInput${index}`}
                        />
                        <div
                            className="flex items-center justify-center bg-gray-300 rounded-lg w-full h-24 cursor-pointer overflow-hidden"
                            onClick={() => document.getElementById(`gridFileInput${index}`).click()}
                        >
                            {gridImage ? (
                                <div className="relative w-full h-full">
                                    <img src={gridImage.imageUrl} alt={`Grid ${index}`} className="w-full h-full object-cover rounded-lg" />
                                    <img
                                        src={xIcon}
                                        alt="Remove"
                                        className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full p-1 cursor-pointer border border-gray-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveGridImage(index);
                                        }}
                                    />
                                </div>
                            ) : (
                                <img
                                    src={addIcon}
                                    alt="Add"
                                    className="w-6 h-6"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadImagesPage;