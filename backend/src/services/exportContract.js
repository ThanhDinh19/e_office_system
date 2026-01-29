const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const authorize = require('../middlewares/role.middleware');


function exportContract(employee, authorizedPerson, authorization, companyInfo) {

  let templatePath = '';

  const contract = employee?.EmployeeContracts?.[0] || {};
  const contract_type = contract?.contract_type || '';

  if (contract_type === 'PROBATION') {
    templatePath = path.join(__dirname, '../templates/probationary_contract.docx');
  } else if(contract_type === 'FIXED-TERM') {
    templatePath = path.join(__dirname, '../templates/fixed_term_contract.docx');
  }
  else{
    templatePath = path.join(__dirname, '../templates/training_contract.docx');
  }


  // Check if template file exists
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Contract template not found at ${templatePath}. Please create probationary_contract.docx in the templates folder.`);
  }

  const content = fs.readFileSync(templatePath, 'binary');

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });



  console.log({
    contract
  });

  const now = new Date();

  const day = now.getDate();
  const month = now.getMonth() + 1; // tháng bắt đầu từ 0
  const year = now.getFullYear();

  doc.render({

    // số ủy quyền
    authorization: authorization.authorization_no,

    // bên a
    company_name: companyInfo.company_name,
    company_address: companyInfo.address,
    company_phone: companyInfo.phone,
    tax_code: companyInfo.tax_code,
    bank_account: companyInfo.bank_account,

    // hr (authorizedPerson)  
    authorized_name: authorizedPerson.full_name,
    authorized_position: authorizedPerson.Position.name,
    authorized_cccd: authorizedPerson.cccd,
    authorized_cccd_date: authorizedPerson.cccd_issue_date,
    authorized_cccd_place: authorizedPerson.cccd_issue_place,
    authorized_permanent_address: authorizedPerson.permanent_address,
    authorized_phone: authorizedPerson.phone,

    // người lao động
    full_name: employee.full_name,
    dob: employee.dob,
    cccd: employee.cccd,
    position: employee.Position?.name,
    department: employee.Department?.name,
    address: employee.address,
    permanent_address: employee.permanent_address,
    phone: employee.phone,
    job_title: employee.job_title,
    place_of_birth: employee.place_of_birth,
    nationality: employee.nationality,
    cccd_issue_date: employee.cccd_issue_date,
    cccd_issue_place: employee.cccd_issue_place,
    labor_book_number: employee.labor_book_number,
    labor_book_issue_date: employee.labor_book_issue_date,
    labor_book_issue_place: employee.labor_book_issue_place,
    profession: employee.profession,

    // contract
    contract_type: contract?.contract_type,
    contract_number: contract?.contract_number,
    start_date: contract?.start_date,
    end_date: contract?.end_date,
    probation_from: contract?.probation_from,
    probation_to: contract?.probation_to,
    duration_months: contract?.duration_months,
    workplace: contract?.workplace,
    department_name: contract?.department_name,
    job_description: contract?.job_description,
    salary: contract?.salary,
    salary_grade: contract?.salary_grade || '',
    salary_level: contract?.salary_level?.toString() || '',

    now_date: new Date().toLocaleDateString('vi-VN'),
    sign_date: new Date().toLocaleDateString('vi-VN'),

    day: day,
    month: month,
    year: year,


  });

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });

  return buffer;
}

module.exports = exportContract;
