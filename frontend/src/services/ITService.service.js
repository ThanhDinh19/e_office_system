import axios from './axios';

export const addITService = async (data) => {
    const res = await axios.post(`/itservices`, data);
    return res.data;
}

export const getITServices = async () => {
    const res = await axios.get('/itservices');
    return res.data;
}

export const editITService = async (id, data) => {
    const res = await axios.put(`/itservices/${id}/edit`, data);
    return res.data;
}

export const deleteITService = async (id) => {
    const res = await axios.delete(`/itservices/${id}/delete`);
    return res.data;
}