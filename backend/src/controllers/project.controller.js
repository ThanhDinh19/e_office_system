const { sequelize, Project, Employee, ProjectMember, TaskGroup, Task, TaskComment } = require('../models')
const { mapProjectData } = require('../mappers/project.mapper');


const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get projects' })
    }
}


const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const projectMembers = await ProjectMember.findAll({
      where: { project_id: projectId },
      include: [
        {
          model: Employee,
          attributes: ['id', 'full_name'],
        },
      ],
    });

    return res.json(projectMembers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Failed to get project members',
    });
  }
};


const createProject = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const projectData = mapProjectData(req.body);

        const project = await Project.create(projectData, { transaction: t });
        await t.commit();

        res.status(201).json({
            id: project.id,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create project' })
    }
}


const addProjectMembers = async (req, res) => {
    const { projectId } = req.params;
    const { members } = req.body;

    if (!Array.isArray(members)) {
        return res.status(400).json({ message: 'Members is required' });
    }

    for (const m of members) {
        const exists = await ProjectMember.findOne({
            where: {
                project_id: projectId,
                employee_id: m.employee_id,
            },
        });

        if (exists) {
            continue; // bỏ qua member đã tồn tại
        }

        await ProjectMember.create({
            project_id: projectId,
            employee_id: m.employee_id,
            role_in_project: m.role_in_project || 'Member',
        });
    }

    res.json({ message: 'Members added successfully' });
};

const deleteProject = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      await t.rollback();
      return res.status(404).json({ message: 'Project not found' });
    }

    // 1. Xóa comments của task
    const tasks = await Task.findAll({
      include: {
        model: TaskGroup,
        where: { project_id: id },
      },
      transaction: t,
    });

    const taskIds = tasks.map(t => t.id);

    if (taskIds.length) {
      await TaskComment.destroy({
        where: { task_id: taskIds },
        transaction: t,
      });
    }

    // 2. Xóa tasks
    await Task.destroy({
      where: { id: taskIds },
      transaction: t,
    });

    // 3. Xóa task groups
    await TaskGroup.destroy({
      where: { project_id: id },
      transaction: t,
    });

    // 4. Xóa members
    await ProjectMember.destroy({
      where: { project_id: id },
      transaction: t,
    });

    // 5. Xóa project
    await project.destroy({ transaction: t });

    await t.commit();

    res.json({ message: 'Project deleted successfully' });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update(req.body);

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update project failed' });
  }
};

const createTaskGroup = async (req, res) => {
  try {
    //  projectId lấy từ params
    const { projecId } = req.params;
    const { name } = req.body;

    if (!projecId || !name) {
      return res.status(400).json({
        message: 'projectId and name are required',
      });
    }

    // Check project exists
    const project = await Project.findByPk(projecId);
    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    //  đúng tên cột project_id
    const taskGroup = await TaskGroup.create({
      project_id: projecId,
      name,
    });

    return res.status(201).json(taskGroup);

  } catch (err) {
    console.error('createTaskGroup error:', err);
    return res.status(500).json({
      message: 'Failed to create task group',
    });
  }
};



const createTask = async (req, res) => {
  try {
    const { taskGroupId } = req.params;
    const {
      title,
      description,
      assignee_id,
      priority,
      deadline,
    } = req.body;

    /* ===== 1. Validate ===== */
    if (!taskGroupId || !title) {
      return res.status(400).json({
        message: 'taskGroupId and title are required',
      });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        message: 'Invalid priority value',
      });
    }

    /* ===== 2. Check Task Group exists ===== */
    const taskGroup = await TaskGroup.findByPk(taskGroupId);
    if (!taskGroup) {
      return res.status(404).json({
        message: 'Task group not found',
      });
    }

    /* ===== 3. Check assignee ===== */
    if (assignee_id) {
      const employee = await Employee.findByPk(assignee_id);
      if (!employee) {
        return res.status(404).json({
          message: 'Assignee not found',
        });
      }
    }

    /* ===== 4. Create Task ===== */
    const task = await Task.create({
      task_group_id: taskGroupId, // ✅ map đúng DB
      title,
      description: description || null,
      assignee_id: assignee_id || null,
      priority: priority || 'medium',
      deadline: deadline || null,
      status: 'new',
    });

    return res.status(201).json(task);

  } catch (err) {
    console.error('createTask error:', err);
    return res.status(500).json({
      message: 'Failed to create task',
    });
  }
};




module.exports = {
    getProjects,
    createProject,
    addProjectMembers,
    deleteProject,
    updateProject,
    getProjectMembers,
    createTaskGroup,
    createTask,
}