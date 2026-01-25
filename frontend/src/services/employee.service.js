import axios from './axios'; // axios đã gắn token interceptor

export const createEmployee = async (data) => {
  const res = await axios.post('/employees', data);
  return res.data;
};

export const getEmployeeById = async (id) => {
  const res = await axios.get(`/employees/${id}`);
  return res.data;
}

export const updateEmployee = async (id, data) => {
  const res = await axios.put(`/employees/${id}`, data);
  return res.data;
}

export const updateAccount = async (id, data) => {
  const res = await axios.put(`/employees/${id}/account`, data);
  return res.data;
}

export const uploadAvatar = async (id, formData) => {
  const res = await axios.post(
    `/employees/${id}/avatar`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};

export const updateJobInfo = async (id, data) => {
  const res = await axios.put(`/employees/${id}/job-info`, data);
  return res.data;
}

export const getSocialLinks = async (id) => {
  const res = await axios.get(`/employees/social-links/${id}`);
  return res.data;
}

export const updateSocialLinks = async (id, data) => {
  const res = await axios.put(`/employees/${id}/social-links`, data)
  return res.data;
}

export const updateContract = async (id, data) => {
  const res = await axios.put(`/employees/${id}/contract`, data)
  return res.data;
}