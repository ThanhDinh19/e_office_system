import axios from "./axios";

export const getDepartments = async () => {
    const res = await axios.get('/departments');
    return res.data;
}