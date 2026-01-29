const sequelize = require('../config/database');

// Import all models
const Employee = require('./employee.model');
const User = require('./user.model');
const Role = require('./role.model');
const UserRole = require('./user-role');
const LeaveRequest = require('./leave-request.model');
const Department = require('./department.model');
const Position = require('./position.model');
const EmployeeContract = require('./employee-contract.model');
const LeaveType = require('./leave-type.model');
const LeaveBalance = require('./leave-balance.model');
const LeaveApproval = require('./leave-approval.model');
const AttendanceLog = require('./attendance-log.model');
const Project = require('./project.model');
const ProjectMember = require('./project-member.model');
const TaskGroup = require('./task-group.model');
const Task = require('./task.model');
const TaskComment = require('./task-comment.model');
const Ticket = require('./ticket.model');
const Branch = require('./branch.model');
const MeetingRoom = require('./meeting-room.model');
const RoomBooking = require('./room-booking.model');
const MeetingParticipant = require('./meeting-participant.model');
const Asset = require('./asset.model');
const AssetAssignment = require('./asset-assignment.model');
const AssetMaintenance = require('./asset-maintenance.model');
const SocialLink = require('./social-link.model');
const CompanyInfo = require('./companyInfo.model');
const Authorization = require('./authorization.model');
/* ========== Associations ========== */

// Employee - User (1 - 1)
Employee.hasOne(User, { foreignKey: 'employee_id' });
User.belongsTo(Employee, { foreignKey: 'employee_id' });

// User - Role (N - N)
User.belongsToMany(Role, {
  through: 'user_roles',
  foreignKey: 'user_id',
  timestamps: false,
});
Role.belongsToMany(User, {
  through: 'user_roles',
  foreignKey: 'role_id',
  timestamps: false,
});

// Employee - LeaveRequest (1 - N)
Employee.hasMany(LeaveRequest, {
  foreignKey: 'employee_id',
});
LeaveRequest.belongsTo(Employee, {
  foreignKey: 'employee_id',
});

// Employee - SocialLink (1 - N)
Employee.hasMany(SocialLink, {
  foreignKey: 'employee_id',
});
SocialLink.belongsTo(Employee, {
  foreignKey: 'employee_id',
});

// Department - Employee (1 - N)
Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

// Position - Employee (1 - N)
Position.hasMany(Employee, { foreignKey: 'position_id' });
Employee.belongsTo(Position, { foreignKey: 'position_id' });

// Employee - EmployeeContract (1 - N)
Employee.hasMany(EmployeeContract, { foreignKey: 'employee_id' });
EmployeeContract.belongsTo(Employee, { foreignKey: 'employee_id' });

// LeaveType - LeaveRequest (1 - N)
LeaveType.hasMany(LeaveRequest, { foreignKey: 'leave_type_id' });
LeaveRequest.belongsTo(LeaveType, { foreignKey: 'leave_type_id' });

// LeaveBalance - Employee (1 - 1)
LeaveBalance.belongsTo(Employee, { foreignKey: 'employee_id' });

// LeaveApproval - LeaveRequest (N - 1)
LeaveApproval.belongsTo(LeaveRequest, { foreignKey: 'leave_request_id' });
LeaveRequest.hasMany(LeaveApproval, { foreignKey: 'leave_request_id' });

// LeaveApproval - User (N - 1)
LeaveApproval.belongsTo(User, { foreignKey: 'approver_id' });

// AttendanceLog - Employee (N - 1)
AttendanceLog.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(AttendanceLog, { foreignKey: 'employee_id' });

// Project - Employee (N - 1) as manager
Project.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });
Employee.hasMany(Project, { foreignKey: 'manager_id', as: 'managedProjects' });

// Project - ProjectMember (1 - N)
Project.hasMany(ProjectMember, { foreignKey: 'project_id' });
ProjectMember.belongsTo(Project, { foreignKey: 'project_id' });

// ProjectMember - Employee (N - 1)
ProjectMember.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(ProjectMember, { foreignKey: 'employee_id' });


User.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(User, { foreignKey: 'employee_id' });

User.hasMany(UserRole, { foreignKey: 'user_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });

// UserRole - User (N - 1)
UserRole.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserRole, { foreignKey: 'user_id' });


// Project - TaskGroup (1 - N)
Project.hasMany(TaskGroup, { foreignKey: 'project_id' });
TaskGroup.belongsTo(Project, { foreignKey: 'project_id' });

// TaskGroup - Task (1 - N)
TaskGroup.hasMany(Task, { foreignKey: 'task_group_id' });
Task.belongsTo(TaskGroup, { foreignKey: 'task_group_id' });

// Task - Employee (N - 1) as assignee
Task.belongsTo(Employee, { foreignKey: 'assignee_id', as: 'assignee' });
Employee.hasMany(Task, { foreignKey: 'assignee_id', as: 'assignedTasks' });

// Task - TaskComment (1 - N)
Task.hasMany(TaskComment, { foreignKey: 'task_id' });
TaskComment.belongsTo(Task, { foreignKey: 'task_id' });

// TaskComment - User (N - 1)
TaskComment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(TaskComment, { foreignKey: 'user_id' });

// Ticket - User (N - 1)
Ticket.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Ticket, { foreignKey: 'user_id' });

// Branch - MeetingRoom (1 - N)
Branch.hasMany(MeetingRoom, { foreignKey: 'branch_id' });
MeetingRoom.belongsTo(Branch, { foreignKey: 'branch_id' });

// MeetingRoom - RoomBooking (1 - N)
MeetingRoom.hasMany(RoomBooking, { foreignKey: 'room_id' });
RoomBooking.belongsTo(MeetingRoom, { foreignKey: 'room_id' });

// RoomBooking - Employee (N - 1) as organizer
RoomBooking.belongsTo(Employee, { foreignKey: 'organizer_id', as: 'organizer' });
Employee.hasMany(RoomBooking, { foreignKey: 'organizer_id', as: 'organizedMeetings' });

// RoomBooking - MeetingParticipant (1 - N)
RoomBooking.hasMany(MeetingParticipant, { foreignKey: 'booking_id' });
MeetingParticipant.belongsTo(RoomBooking, { foreignKey: 'booking_id' });

// MeetingParticipant - Employee (N - 1)
MeetingParticipant.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(MeetingParticipant, { foreignKey: 'employee_id' });

// Asset - AssetAssignment (1 - N)
Asset.hasMany(AssetAssignment, { foreignKey: 'asset_id' });
AssetAssignment.belongsTo(Asset, { foreignKey: 'asset_id' });

// AssetAssignment - Employee (N - 1)
AssetAssignment.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(AssetAssignment, { foreignKey: 'employee_id' });

// Asset - AssetMaintenance (1 - N)
Asset.hasMany(AssetMaintenance, { foreignKey: 'asset_id' });
AssetMaintenance.belongsTo(Asset, { foreignKey: 'asset_id' });

// Department - Department (Self-join for parent_id)
Department.hasMany(Department, { foreignKey: 'parent_id', as: 'subdepartments' });
Department.belongsTo(Department, { foreignKey: 'parent_id', as: 'parentDepartment' });

module.exports = {
  sequelize,
  Employee,
  User,
  UserRole,
  Role,
  LeaveRequest,
  Department,
  Position,
  EmployeeContract,
  LeaveType,
  LeaveBalance,
  LeaveApproval,
  AttendanceLog,
  Project,
  ProjectMember,
  TaskGroup,
  Task,
  TaskComment,
  Ticket,
  Branch,
  MeetingRoom,
  RoomBooking,
  MeetingParticipant,
  Asset,
  AssetAssignment,
  AssetMaintenance,
  SocialLink,
  CompanyInfo,
  Authorization,
};
