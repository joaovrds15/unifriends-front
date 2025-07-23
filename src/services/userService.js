import { HttpStatusCode } from 'axios';
import apiClient from '../axios/axiosInstance';

export const uploadProfilePicture = (formData) => {
    return apiClient.post(
        '/users/profile-picture',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        }
    )
}

export const uploadUserImage = (formData) => {
    return apiClient.post(
        '/users/images',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        }
    )
}

export const getQuestions = () => {
    return apiClient.get(
        '/questions',
        {
            withCredentials: true,
            redirectStatus: HttpStatusCode.Unauthorized,
            authRedirectPath: '/login'
        }
    )
}

export const getResults = (userId, page) => {
    return apiClient.get(
        `/get-results/user/${userId}?page=${page}&limit=10`,
        {
            withCredentials: true,
            redirectStatus: HttpStatusCode.Unauthorized,
            authRedirectPath: '/login'
        }
    )
}

export const submitUserAnswers = (answers) => {
    return apiClient.post(
        '/answer/save',
        answers,
        {
            headers: {
                'Content-Type' : 'application/json'
            },
            withCredentials: true,
            redirectStatus: HttpStatusCode.Unauthorized,
            authRedirectPath: '/login'
        }
    )
}