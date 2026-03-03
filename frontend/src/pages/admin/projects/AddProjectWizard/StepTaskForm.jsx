import { useState, useEffect } from 'react';
import {
  getProjectMembers,
  createTask,
  createTaskGroup,
} from '../../../../services/project.service';
import './StepTaskForm.css';

export default function StepTaskForm({ projectId, onClose, onSuccess }) {
  const [members, setMembers] = useState([]);
  const [globalAssignedIds, setGlobalAssignedIds] = useState([]); // Tất cả members đã được assign

  // Danh sách các group đã tạo
  const [groupList, setGroupList] = useState([]);

  // Group hiện tại đang tạo
  const [currentGroup, setCurrentGroup] = useState({
    name: '',
    tasks: [
      {
        id: Date.now(),
        title: '',
        description: '',
        assignee_id: '',
        priority: 'medium',
        deadline: '',
      },
    ],
  });

  useEffect(() => {
    getProjectMembers(projectId).then(setMembers);
  }, [projectId]);

  // Members chưa được assign toàn cục
  const availableMembers = members.filter(
    (m) => !globalAssignedIds.includes(m.employee_id)
  );

  // Members đã assign trong group hiện tại
  const currentGroupAssignedIds = currentGroup.tasks
    .map((t) => Number(t.assignee_id))
    .filter(Boolean);

  // Thêm task vào group hiện tại
  const handleAddTask = () => {
    if (availableMembers.length === currentGroupAssignedIds.length) {
      alert('No more available members for this group!');
      return;
    }

    setCurrentGroup({
      ...currentGroup,
      tasks: [
        ...currentGroup.tasks,
        {
          id: Date.now(),
          title: '',
          description: '',
          assignee_id: '',
          priority: 'medium',
          deadline: '',
        },
      ],
    });
  };

  // Xóa task khỏi group hiện tại
  const handleRemoveTask = (taskId) => {
    if (currentGroup.tasks.length === 1) {
      alert('Group must have at least 1 task!');
      return;
    }

    setCurrentGroup({
      ...currentGroup,
      tasks: currentGroup.tasks.filter((t) => t.id !== taskId),
    });
  };

  // Cập nhật task trong group hiện tại
  const handleTaskChange = (taskId, field, value) => {
    setCurrentGroup({
      ...currentGroup,
      tasks: currentGroup.tasks.map((t) =>
        t.id === taskId ? { ...t, [field]: value } : t
      ),
    });
  };

  // Lưu group hiện tại và chuyển sang group mới
  const handleSaveAndNextGroup = () => {
    // Validate
    if (!currentGroup.name.trim()) {
      alert('Please enter group name!');
      return;
    }

    const invalidTasks = currentGroup.tasks.filter(
      (t) => !t.title.trim() || !t.assignee_id
    );

    if (invalidTasks.length > 0) {
      alert('All tasks must have title and assignee!');
      return;
    }

    // Lưu group vào danh sách
    setGroupList([...groupList, currentGroup]);

    // Cập nhật danh sách members đã assign toàn cục
    const newAssignedIds = currentGroup.tasks
      .map((t) => Number(t.assignee_id))
      .filter(Boolean);

    setGlobalAssignedIds([...globalAssignedIds, ...newAssignedIds]);

    // Reset form cho group mới
    setCurrentGroup({
      name: '',
      tasks: [
        {
          id: Date.now(),
          title: '',
          description: '',
          assignee_id: '',
          priority: 'medium',
          deadline: '',
        },
      ],
    });
  };

  // Xóa một group đã tạo
  const handleRemoveGroup = (index) => {
    const removedGroup = groupList[index];

    // Trả lại members về available
    const removedAssignedIds = removedGroup.tasks
      .map((t) => Number(t.assignee_id))
      .filter(Boolean);

    setGlobalAssignedIds(
      globalAssignedIds.filter((id) => !removedAssignedIds.includes(id))
    );

    setGroupList(groupList.filter((_, i) => i !== index));
  };

  // Lưu tất cả groups vào database
  const handleFinalSave = async () => {
    if (groupList.length === 0) {
      alert('Please create at least one group!');
      return;
    }

    try {
      for (const group of groupList) {
        // Tạo group
        const createdGroup = await createTaskGroup(projectId, group.name);

        // Tạo từng task trong group
        for (const task of group.tasks) {
          await createTask(createdGroup.id, {
            title: task.title,
            description: task.description,
            assignee_id: task.assignee_id,
            priority: task.priority,
            deadline: task.deadline,
          });
        }
      }

      alert('All groups created successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating groups:', error);
      alert('Failed to create groups!');
    }
  };

  const canAddMoreGroups = availableMembers.length > 0;

  return (
    <div className="task-step-wrapper">
      <h3>Create Group Tasks</h3>

      {/* DANH SÁCH GROUPS ĐÃ TẠO */}
      {groupList.length > 0 && (
        <div className="created-groups-section">
          <h4>Created Groups ({groupList.length})</h4>
          <div className="created-groups-list">
            {groupList.map((group, index) => (
              <div key={index} className="group-card">
                <div className="group-card-header">
                  <strong>📁 {group.name}</strong>
                  <button
                    className="btn-remove-small"
                    onClick={() => handleRemoveGroup(index)}
                    title="Remove group"
                  >
                    ✕
                  </button>
                </div>
                <div className="group-card-body">
                  {group.tasks.map((task, tIndex) => (
                    <div key={tIndex} className="task-summary">
                      <span>• {task.title}</span>
                      <span className="assignee-badge">
                        {members.find((m) => m.employee_id === Number(task.assignee_id))
                          ?.Employee.full_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORM TẠO GROUP MỚI */}
      {canAddMoreGroups && (
        <>
          <div className="current-group-section">
            <h4>
              {groupList.length === 0
                ? 'Create First Group'
                : `Create New Group (${groupList.length + 1})`}
            </h4>

            {/* GROUP NAME */}
            <input
              className="group-input"
              placeholder="Group name (e.g., Backend, UI, Testing...)"
              value={currentGroup.name}
              onChange={(e) =>
                setCurrentGroup({ ...currentGroup, name: e.target.value })
              }
            />

            {/* TASK TABLE */}
            <div className="task-table-wrapper">
              <table className="task-table">
                <thead>
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '20%' }}>Task Title *</th>
                    <th style={{ width: '25%' }}>Description</th>
                    <th style={{ width: '18%' }}>Assignee *</th>
                    <th style={{ width: '12%' }}>Priority</th>
                    <th style={{ width: '15%' }}>Deadline</th>
                    <th style={{ width: '5%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGroup.tasks.map((task, index) => {
                    // Members available cho task này
                    const taskAvailableMembers = members.filter(
                      (m) =>
                        !globalAssignedIds.includes(m.employee_id) &&
                        (!currentGroupAssignedIds.includes(m.employee_id) ||
                          Number(task.assignee_id) === m.employee_id)
                    );

                    return (
                      <tr key={task.id}>
                        <td className="text-center">{index + 1}</td>

                        <td>
                          <input
                            type="text"
                            placeholder="Enter task title"
                            value={task.title}
                            onChange={(e) =>
                              handleTaskChange(task.id, 'title', e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <textarea
                            placeholder="Enter description"
                            value={task.description}
                            onChange={(e) =>
                              handleTaskChange(task.id, 'description', e.target.value)
                            }
                            rows={2}
                          />
                        </td>

                        <td>
                          <select
                            value={task.assignee_id}
                            onChange={(e) =>
                              handleTaskChange(task.id, 'assignee_id', e.target.value)
                            }
                          >
                            <option value="">Select member</option>
                            {taskAvailableMembers.map((m) => (
                              <option key={m.employee_id} value={m.employee_id}>
                                {m.Employee.full_name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            value={task.priority}
                            onChange={(e) =>
                              handleTaskChange(task.id, 'priority', e.target.value)
                            }
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </td>

                        <td>
                          <input
                            type="date"
                            value={task.deadline}
                            onChange={(e) =>
                              handleTaskChange(task.id, 'deadline', e.target.value)
                            }
                          />
                        </td>

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => handleRemoveTask(task.id)}
                            disabled={currentGroup.tasks.length === 1}
                            title="Remove task"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ADD TASK BUTTON */}
            <button
              type="button"
              className="btn-add-task"
              onClick={handleAddTask}
              disabled={
                availableMembers.length === currentGroupAssignedIds.length
              }
            >
              + Add Task to This Group
            </button>

            {/* SAVE AND NEXT GROUP BUTTON */}
            <button
              type="button"
              className="btn-next-group"
              onClick={handleSaveAndNextGroup}
            >
              ✓ Save This Group & Create Next Group
            </button>
          </div>
        </> 
      )}

      {/* THÔNG BÁO HẾT MEMBERS */}
      {!canAddMoreGroups && (
        <div className="hint-text success">
          All members have been assigned to groups!
        </div>
      )}

      {/* ACTIONS */}
      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button
          className="btn-primary" // Class xanh đậm nổi bật
          onClick={handleFinalSave}
          disabled={groupList.length === 0}
        >
          Save All & Finish
        </button>
      </div>

      {/* THỐNG KÊ */}
      <div className="stats-bar">
        <span>Available: {availableMembers.length}</span>
        <span>Assigned: {globalAssignedIds.length}</span>
        <span>Groups: {groupList.length}</span>
      </div>
    </div>
  );
}