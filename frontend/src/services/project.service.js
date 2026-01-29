import axios from './axios';

export const getProjects = async () => {
  const res = await axios.get('/projects');
  return res.data;
};

export const getProjectMembers = async (projectId) => {
  const res = await axios.get(`/projects/memberProjects/${projectId}`);
  return res.data;
}

export const createProject = async (data) => {
  const res = await axios.post(`/projects`, data);
  return res.data;
}

export const addProjectMembers = async (projectId, members) => {
  const res = await axios.post(`/projects/${projectId}/members`, {
    members: members.map(id => ({
      employee_id: Number(id),
      role_in_project: 'Member'
    }))
  });
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await axios.delete(`/projects/${id}`);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await axios.put(`/projects/${id}`, data);
  return res.data;
}

export const createTaskGroup = async (projectId, name) => {
  const res = await axios.post(
    `/projects/${projectId}/task-group`,
    { name }  
  );
  return res.data;
};

export const createTask = async (taskGroupId, data) => {
  const res = await axios.post(
    `/projects/${taskGroupId}/task`,
    data
  );
  return res.data;
};

  