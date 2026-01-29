import axios from './axios';

export const getUsers = async () => {
  const res = await axios.get('/admin/users');
  return res.data;
};

export const deactivateUser = async (id) => {
    const res = await axios.put(`/admin/users/${id}/deactivate`);
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

export const resetPassword = async (id) => {
  const res = await axios.get(`/admin/users/reset-password/${id}`);
  return res.data;
}
