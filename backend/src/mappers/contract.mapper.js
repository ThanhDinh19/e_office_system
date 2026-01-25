const {normalizeDate} = require('../utils/normalizeDate.util');

exports.mapEmployeeInfoData = (body) => ({
  full_name: body.full_name,
  cccd: body.cccd,

  cccd_issue_date: normalizeDate(body.cccd_issue_date),
  cccd_issue_place: body.cccd_issue_place || null,

  labor_book_number: body.labor_book_number || null,
  labor_book_issue_date: normalizeDate(body.labor_book_issue_date),
  labor_book_issue_place: body.labor_book_issue_place || null,

  profession: body.profession || null,
  email: body.email || null,
  phone: body.phone || null,

  address: body.address || null,
  permanent_address: body.permanent_address || null,

  place_of_birth: body.place_of_birth || null,
  nationality: body.nationality || null,

  dob: normalizeDate(body.dob),
  gender: body.gender || null,

  department_id: body.department_id || null,
  position_id: body.position_id || null,
  contract_type: body.contract_type || null,
  job_title: body.job_title || null,
  join_date: normalizeDate(body.join_date),

});


exports.mapEmployeeContractData = (body, employeeId) => ({
  employee_id: employeeId,

  start_date: normalizeDate(body.start_date),
  end_date: normalizeDate(body.end_date),

  job_title: body.job_title || null,
  job_description: body.job_description || null,

  salary: body.salary || null,
  salary_grade: body.salary_grade || null,
  salary_level: body.salary_level || null,

  contract_type: body.contract_type || null,
  contract_number: body.contract_number || null,

  probation_from: normalizeDate(body.probation_from),
  probation_to: normalizeDate(body.probation_to),

  duration_months: body.duration_months || null,
  workplace: body.workplace || null,

  sign_date: normalizeDate(body.sign_date),
  status: body.contract_status || null,
});
