const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function exportContract(employee) {
  const templatePath = path.join(__dirname, '../templates/contract_template.docx');
  
  // Check if template file exists
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Contract template not found at ${templatePath}. Please create contract_template.docx in the templates folder.`);
  }
  
  const content = fs.readFileSync(templatePath, 'binary');

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render({
    full_name: employee.full_name,
    dob: employee.dob,
    cccd: employee.cccd,
    position: employee.Position?.name,
    department: employee.Department?.name,
    sign_date: new Date().toLocaleDateString('vi-VN'),
  });

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });

  return buffer;
}

module.exports = exportContract;
