/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL_API || 'https://wayu-taya-api.onrender.com'}/api`
})

export const getDataApi = async (url: string) => {
    try {
        return await api.get(url).then(res => {
            return res.data
        })
    } catch (err) {
        console.log(err);
    }
}

export const postDataApi = async (url: string, body: any) => {
    try {
        return await api.post(url, body).then(res => {
            return res.data
        })
    } catch (err) {
        console.log(err);
    }
}

export const putDataApi = async (url: string, body: any) => {
    try {
        return await api.put(url, body).then(res => {
            return res.data
        })
    } catch (err) {
        console.log(err);
    }
}

export const deleteDataApi = async (url: string) => {
    try {
        return await api.delete(url).then(res => {
            return res.data
        })
    } catch (err) {
        console.log(err);
    }
}