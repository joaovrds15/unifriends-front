import { HttpStatusCode } from 'axios';
import apiClient from '../axios/axiosInstance';

export const submitVerificationEmail = (email) => {
    return apiClient.get(
        `verify/email/` + email,
        {
            headers:  { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
    )
}

export const getVerificationCodeExpiration = (email) => {
    return apiClient.get(
        `verify/code/` + email,
        {
            headers:  { 'Content-Type': 'application/json' },
            withCredentials: true,
            redirectStatus: HttpStatusCode.Conflict,
            authRedirectPath: '/signup/email'
        }
    )
}

export const sendVerificationCode = (email, code) => {
    return apiClient.post(
        'verify/email',
        {
            email : email,
            verification_code : Number(code)
        },
        {
            withCredentials: true,
        }
    )
}

export const getMajors = () => {
    return apiClient.get(
        '/majors',
        {
            withCredentials: true,
        }
    )
}

export const sendRegistrationData = (registrationData) => {
    return apiClient.post(
        '/register',
        registrationData,
        {
            headers:  { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
    )
}