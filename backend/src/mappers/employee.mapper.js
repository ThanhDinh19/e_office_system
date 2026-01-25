exports.mapEmployeeData = (body) => ({
  full_name: body.fullname,
  cccd: body.cccd,
  email: body.email,
  phone: body.phone,
  address: body.address,
  dob: body.dob || null,
  gender: body.gender,
  department_id: body.department_id,
  position_id: body.position_id,
  contract_type: body.contract_type,
  job_title: body.jobTitle,
  join_date: body.hireDate,
});

exports.mapContractData = (body, employeeId) => ({
  employee_id: employeeId,
  start_date: body.hireDate,
  end_date: body.endDate || null,
  job_title: body.jobTitle,
  salary: body.salary,
  contract_type: body.contract_type,
});

exports.mapUserData = (body, employeeId, passwordHash) => ({
  employee_id: employeeId,
  username: body.username,
  email: body.email,
  password_hash: passwordHash,
});

exports.mapUserRole = (body, userId) => ({
  user_id: userId,
  role_id: body.role_id,
}) 