import axios from './axios';

export const getUsers = async () => {
  const res = await axios.get('/admin/users');
  return res.data;
};

export const deleteUser = async () => {
    const res = await axios.get('/admin/user/:id');
    return res.data;
}

export const exportContract = async (id) => {
  const res = await axios.get(`/admin/users/export-contract/${id}`, {
    responseType: 'blob',
  });
  
  // Tạo link download từ blob
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `contract_${id}.docx`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
}