import React, { useState, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import '../components/components_css/UploadImagesPage.css';
import profileAvatar from '../icons/user.png';
import addIcon from '../icons/add.svg';
import xIcon from '../icons/close.svg';
import libraryBackground from '../temp/Image.png';
import { RegistrationContext } from '../context/RegistrationContext';

const UploadImagesPage = () => {
    const navigate = useNavigate();

    const [profilePic, setProfilePic] = useState(profileAvatar);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [gridImages, setGridImages] = useState(Array(7).fill(null));
    const { registrationData, setRegistrationData } = useContext(RegistrationContext);

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
            const response = await fetch("http://localhost:8090/api/upload-image", {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.status == 201) {
                const data = await response.json();
                return data['image-url'];
            } else {
                console.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
        return null;
    };

    const handleSaveImages = async () => {
        let profilePictureUrl = profilePic;
        if (profilePicFile) {
            profilePictureUrl = await uploadImage(profilePicFile);
        }

        const usersImages = await Promise.all(
            gridImages.map(async (gridImage) => {
                if (gridImage && gridImage.file) {
                    return await uploadImage(gridImage.file);
                }
                return null;
            })
        );
        setRegistrationData({
            ...registrationData,
            profilePictureUrl,
            usersImages: usersImages.filter((url) => url !== null),
        });
        //images worng backend
        const formattedData = {
            name: registrationData.firstName,
            email: registrationData.email,
            password: registrationData.password,
            re_password: registrationData.rePassword,
            phone_number: registrationData.phoneNumber.replace(/\D/g, ''),
            profile_picture_url: registrationData.profilePictureUrl,
            images: registrationData.usersImages,
            major_id: parseInt(registrationData.majorId),
          };

        try {
            const response = await fetch('http://localhost:8090/api/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });
    
            if (response.ok) {
                navigate('/profile');
            } else {
                console.error('Failed to save registration data');
            }
        } catch (error) {
            console.error('Error saving registration data:', error);
        }
    };

    return (
        <div className="profile-container">
            <div className="background-image">
                <img src={libraryBackground} alt="Background" className="background-img" />
            </div>

            <div className="profile-section">
                <div className="profile-avatar-container" onClick={handleProfileImageClick}>
                    <img src={profilePic} alt="Profile" className="profile-pic" />
                    <img
                        src={isImageUploaded ? xIcon : addIcon} 
                        alt={isImageUploaded ? "Remove" : "Add"}
                        data-action={isImageUploaded ? "Remove" : "Add"}
                        className="add-icon-overlay" 
                        style={{ width: '25px', height: '25px' }} 
                    />
                </div>
                <h2>Adicione suas imagens</h2>
                <input 
                    type="file"
                    id="fileInput" 
                    accept="image/*" 
                    className='file-input'
                    onChange={handleProfileImageChange}
                    style={{ display: 'none' }}
                />
            </div>

            <button className="connect-btn" onClick={handleSaveImages}>Salvar</button>

            <div className="image-grid">
                {gridImages.map((gridImage, index) => (
                    <div className="image-container" key={index}>
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input"
                            onChange={(event) => handleGridImageChange(event, index)}
                            style={{ display: 'none' }}
                            id={`gridFileInput${index}`}
                        />
                        <div className="grid-image-placeholder" onClick={() => document.getElementById(`gridFileInput${index}`).click()}>
                            {gridImage ? (
                                <div>
                                    <img src={gridImage.imageUrl} alt={`Grid ${index}`} className="grid-image" />
                                    <img 
                                        src={xIcon} 
                                        alt="Remove"
                                        className="add-icon-overlay"
                                        onClick={() => handleRemoveGridImage(index)}
                                        style={{ width: '25px', height: '25px' }} 
                                    />
                                </div>
                            ) : (
                                <img 
                                    src={addIcon} 
                                    alt="Add" 
                                    className="add-icon-overlay"
                                    style={{ width: '25px', height: '25px' }} 
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