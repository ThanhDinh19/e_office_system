import axios from '../../../frontend/src/services/axios';

export const getCompanyInfo = async () => {
    const res = await axios.get('/company-info');
    return res.data;
}