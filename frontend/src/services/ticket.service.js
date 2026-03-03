import axios from './axios'; // axios đã gắn token interceptor

export const createTicket = async (data) => {
  const res = await axios.post('/tickets', data);
  return res.data;
}

export const getTickets = async () => {
  const res = await axios.get('/tickets');
  return res.data;
} 

export const getNewTicketCount = async () => {
  const res = await axios.get('/tickets/new-count');
  return res.data;
};