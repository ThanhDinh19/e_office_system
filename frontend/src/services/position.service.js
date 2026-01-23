import axios from './axios';

export const getPositions = async () => {
  const res = await axios.get('/positions');
  return res.data;
};